import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CitizenshipMapAll from './Graphs/CitizenshipMapAll';
import CitizenshipMapSingleOffice from './Graphs/CitizenshipMapSingleOffice';
import TimeSeriesAll from './Graphs/TimeSeriesAll';
import OfficeHeatMap from './Graphs/OfficeHeatMap';
import TimeSeriesSingleOffice from './Graphs/TimeSeriesSingleOffice';
import YearLimitsSelect from './YearLimitsSelect';
import ViewSelect from './ViewSelect';
import axios from 'axios';
import { resetVisualizationQuery } from '../../../state/actionCreators';
// import test_data from '../../../data/test_data.json';
import { colors } from '../../../styles/data_vis_colors';
import ScrollToTopOnMount from '../../../utils/scrollToTopOnMount';

const { background_color } = colors;
const url1 = `https://hrf-asylum-be-b.herokuapp.com/cases/fiscalsummary`;
console.log(url1);
const url2 = `https://hrf-asylum-be-b.herokuapp.com/cases/citizenshipSummary`;
console.log(url2);

function GraphWrapper(props) {
  const { set_view, dispatch } = props;
  let { office, view } = useParams();
  if (!view) {
    set_view('time-series');
    view = 'time-series';
  }
  let map_to_render;
  if (!office) {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesAll />;
        break;
      case 'office-heat-map':
        map_to_render = <OfficeHeatMap />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapAll />;
        break;
      default:
        break;
    }
  } else {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesSingleOffice office={office} />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapSingleOffice office={office} />;
        break;
      default:
        break;
    }
  }
  function updateStateWithNewData(years, view, office, stateSettingCallback) {
    if (office === 'all' || !office) {
      const fiscalSummary = axios.get(url1, {
        params: {
          from: years[0],
          to: years[1],
        },
      });

      const citizenshipSummary = axios.get(url2, {
        params: {
          from: years[0],
          to: years[1],
        },
      });

      Promise.all([fiscalSummary, citizenshipSummary])
        .then(response => {
          const [fsResponse, csResponse] = response.map(result => result.data);

          const newData = [
            {
              granted: fsResponse.granted,
              adminClosed: fsResponse.adminClosed,
              denied: fsResponse.denied,
              closedNacaraGrant: fsResponse.closedNacaraGrant,
              asylumTerminated: fsResponse.asylumTerminated,
              totalCases: fsResponse.totalCases,
              yearResults: fsResponse.yearResults.map(year => ({
                fiscal_year: year.fiscal_year,
                granted: year.granted,
                adminClosed: year.adminClosed,
                denied: year.denied,
                closedNacaraGrant: year.closedNacaraGrant,
                asylumTerminated: year.asylumTerminated,
                totalCases: year.totalCases,
                yearData: year.yearData.map(office => ({
                  office: office.office,
                  granted: office.granted,
                  adminClosed: office.adminClosed,
                  denied: office.denied,
                  closedNacaraGrant: office.closedNacaraGrant,
                  asylumTerminated: office.asylumTerminated,
                  totalCases: office.totalCases,
                })),
              })),
              citizenshipResults: csResponse.map(country => ({
                citizenship: country.citizenship,
                granted: country.granted,
                adminClosed: country.adminClosed,
                denied: country.denied,
                closedNacaraGrant: country.closedNacaraGrant,
                asylumTerminated: country.asylumTerminated,
                totalCases: country.totalCases,
              })),
            },
          ];

          stateSettingCallback(view, office, newData);
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      const fiscalSummary = axios.get(
        `https://hrf-asylum-be-b.herokuapp.com/cases/fiscalSummary`,
        {
          params: {
            from: years[0],
            to: years[1],
          },
        }
      );

      const citizenshipSummary = axios.get(
        `https://hrf-asylum-be-b.herokuapp.com/cases/citizenshipSummary`,
        {
          params: {
            from: years[0],
            to: years[1],
            office: office,
          },
        }
      );

      Promise.all([fiscalSummary, citizenshipSummary])
        .then(response => {
          const [fsResponse, csResponse] = response.map(result => result.data);

          const newData = [
            {
              granted: fsResponse.granted,
              adminClosed: fsResponse.adminClosed,
              denied: fsResponse.denied,
              closedNacaraGrant: fsResponse.closedNacaraGrant,
              asylumTerminated: fsResponse.asylumTerminated,
              totalCases: fsResponse.totalCases,
              yearResults: fsResponse.yearResults.map(year => ({
                fiscal_year: year.fiscal_year,
                granted: year.granted,
                adminClosed: year.adminClosed,
                denied: year.denied,
                closedNacaraGrant: year.closedNacaraGrant,
                asylumTerminated: year.asylumTerminated,
                totalCases: year.totalCases,
                yearData: year.yearData.map(office => ({
                  office: office.office,
                  granted: office.granted,
                  adminClosed: office.adminClosed,
                  denied: office.denied,
                  closedNacaraGrant: office.closedNacaraGrant,
                  asylumTerminated: office.asylumTerminated,
                  totalCases: office.totalCases,
                })),
              })),
              citizenshipResults: csResponse.map(country => ({
                citizenship: country.citizenship,
                granted: country.granted,
                adminClosed: country.adminClosed,
                denied: country.denied,
                closedNacaraGrant: country.closedNacaraGrant,
                asylumTerminated: country.asylumTerminated,
                totalCases: country.totalCases,
              })),
            },
          ];

          stateSettingCallback(view, office, newData);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
  const clearQuery = (view, office) => {
    dispatch(resetVisualizationQuery(view, office));
  };
  return (
    <div
      className="map-wrapper-container"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '50px',
        backgroundColor: background_color,
      }}
    >
      <ScrollToTopOnMount />
      {map_to_render}
      <div
        className="user-input-sidebar-container"
        style={{
          width: '300px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ViewSelect set_view={set_view} />
        <YearLimitsSelect
          view={view}
          office={office}
          clearQuery={clearQuery}
          updateStateWithNewData={updateStateWithNewData}
        />
      </div>
    </div>
  );
}

export default connect()(GraphWrapper);
