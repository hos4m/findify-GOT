import { connect } from 'react-redux';
import { getPrevData, getNextData } from '../redux/actions';
import App from '../components/App.jsx';

const mapStateToProps = (state, ownProps) => ({
  data: state,
});

const mapDispatchToProps = {  
  getPrevData,
  getNextData,
};

const AppContainer = connect(  
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;