import React from 'react'; 
import './App.css';
import TruthTable from './TruthTable';
import ActiveClauseCoverage from './ActiveClauseCoverage';

function App() {
  return (
    <div className="App" style={{backgroundColor: '#e1e5f0', minHeight: '100vh', padding: '20px'}}>
      <h1 style={{fontFamily: 'Arial, sans-serif', fontSize: '36px', fontWeight: 'bold', marginBottom: '20px'}}>Welcome to Logic Coverage Assessment</h1>
      <h2 style={{fontFamily: 'Arial, sans-serif', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>Supported Logic Operators:</h2>

      <table width="80%" align="center" style={{marginBottom: '20px'}}> 
        <tbody>
          <tr>
            <td>Not: <b>!</b></td> 
            <td>And: <b>&amp;</b></td> 
            <td>Or: <b>|</b></td>     
            <td>Exclusive Or: <b>^</b></td> 
            <td>Equivalence: <b>=</b></td>
          </tr> 
        </tbody>
      </table>

      <h10 style={{fontFamily: 'Georgia, sans-serif', fontSize: '18px', marginBottom: '20px'}}>
        Please utilize the text box below to input your predicate expression, adhering to the specified logical operators given. <br></br>Variable names can be customized as per your requirement. Additionally, feel free to include parentheses for better expression organization.<br></br>Please note that for predicate expression consisting more than 7 variables may slow down the generating Truth Tables and Clause Pairs.
      </h10>
      
      <TruthTable />
      <ActiveClauseCoverage />
    </div>
  );
}

export default App;

export default App;
