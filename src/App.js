import React from 'react'; 
import './App.css';
import TruthTable from './TruthTable';
import ActiveClauseCoverage from './ActiveClauseCoverage';

function App() {
  return (
    <div style={{backgroundColor: '#e1e5f0'}}>
    <div className="App">
      <h2 style={{fontFamily:'Arial,sans-serif',fontSize:'36px',fontWeight:'bold',marginBottom:'20px'}}>Welcome to Logic Coverage Assessment </h2>
      <h4>This Logic Criteria accepts the following operators:</h4>
      

      <table width="50%" align='center'> 
	<tbody><tr>
    <td> Not :<font size="4"> <b>!</b></font></td> 
		<td> And :<font size="4"> <b>&amp;</b></font></td> 
		<td> Or :<font size="4"> <b>|</b></font></td>     
		<td> Exclusive Or :<font size="4"> <b>^</b></font></td> 
		<td> Equivalence :<font size="4"> <b>=</b></font></td>
    </tr> 

	</tbody></table>
	<h5>Welcome! Please utilize the text box below to input your logical expression, adhering to the specified logic operators mentioned above. Variable names can be customized as per your requirement. Additionally, feel free to include parentheses for better expression organization</h5>
      <TruthTable />
      <ActiveClauseCoverage />
    </div>
    </div>
  );
}

export default App;
