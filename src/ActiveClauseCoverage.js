import React, { useState } from 'react';
import './ActiveClauseCoverage.css'; // Import the CSS for styling

const ActiveClauseCoverage = () => {
  const [predicate, setPredicate] = useState('');
  const [vars, setVars] = useState([]);
  const [truthTable, setTruthTable] = useState([]);
  const [clausePairs, setClausePairs] = useState([]);
  const [truthTableGenerated, setTruthTableGenerated] = useState(false);
  const [clausePairsGenerated, setClausePairsGenerated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  
  const handleChange = (event) => {
    const { value } = event.target;
    if (!value.trim()) {
      setPredicate(value);
      setErrorMessage('Predicate cannot be empty');
    } else {
        const invalidChars = value.match(/[^a-zA-Z0-9()&|!=^ ]|(?<![a-zA-Z0-9])[0-9]+(?![a-zA-Z])/g); // Updated regex to include '^'
        if (invalidChars) {
        const errorMessage = Invalid character(s): ${invalidChars.join(', ')};
        setPredicate(value);
        setErrorMessage(errorMessage);
      } else {
        setPredicate(value);
        setErrorMessage(null);
      }
    }
  };

  



const generateTruthTable = () => {    
    if (!predicate.trim()) {
        setErrorMessage('Please enter a predicate equation.');
        setTruthTableGenerated(false); // Reset truthTableGenerated state
        return;
      }
    
      // Check for invalid symbols or operators
  const invalidSymbols = predicate.match(/[^a-zA-Z0-9()&|!=^ ]/g);
  if (invalidSymbols) {
    setErrorMessage(Invalid symbol(s): ${invalidSymbols.join(', ')});
    return;
  }
      // Check if predicate contains only numerals
      const onlyNumerals = /^\d+$/.test(predicate.replace(/\s/g, ''));
      if (onlyNumerals) {
        setErrorMessage('Predicate cannot contain only numerals.');
        setTruthTableGenerated(false); // Reset truthTableGenerated state
        return;
      }
    
      // Check if variables start with alphabets
      const invalidVars = predicate.match(/\b\d+\w*\b/g);
      if (invalidVars) {
        setErrorMessage(Variables must start with alphabets: ${invalidVars.join(', ')});
        setTruthTableGenerated(false); // Reset truthTableGenerated state
        return;
      }
    
      try {
        const variables = predicate.match(/[a-zA-Z]\w*/g) || [];
        setVars(variables); // Update variables state
    
        const numRows = Math.pow(2, variables.length);
        const table = [];
    
        for (let i = 0; i < numRows; i++) {
          const row = { 'Row No': i + 1 };
          variables.forEach((variable, index) => {
            row[variable] = (i >> index) & 1;
          });
    
          // Replace variables in predicate with their respective values from the row
          const result = eval(predicate.replace(/[a-zA-Z]\w*/g, match => row[match]).replace('=', '===')); // Handling equivalence operator
          row['Result'] = result;
          table.push(row);
        }
    
        setTruthTable(table); // Update truth table state
        setTruthTableGenerated(true); // Update truthTableGenerated state
        setClausePairsGenerated(false); // Reset clausePairsGenerated state
        setErrorMessage(''); // Clear error message
      } catch (error) {
        setErrorMessage('Error generating truth table. Please check your predicate equation.');
        setTruthTableGenerated(false); // Reset truthTableGenerated state
      }
  };
  

  // Function to generate clause pairs based on the truth table
  const generateClausePairs = () => {
    if (!truthTableGenerated) {
      setErrorMessage('Please generate the truth table first.');
      return;
    }

    try {
      const result = [];

      // Iterate through each variable
      vars.forEach((variable, k) => {
        // Initialize lists to store rows where predicate is true or false for the current variable
        const tList = [];
        const fList = [];

        // Iterate through each row of the truth table
        truthTable.forEach((row, i) => {
          // Calculate whether the predicate changes with the current variable set to true or false
          const tVar = evaluateExpression(predicate, {
            ...row,
            [variable]: true,
          });
          const fVar = evaluateExpression(predicate, {
            ...row,
            [variable]: false,
          });

          // If the predicate changes when the variable is toggled, determine if it's true or false in the row
          if (tVar ^ fVar) {
            if (row[variable]) {
              tList.push(i);
            } else {
              fList.push(i);
            }
          }
        });

        // Combine the lists to create pairs of rows (GACC)
        const gacc = [];
        tList.forEach((tIndex) => {
          fList.forEach((fIndex) => {
            gacc.push([tIndex, fIndex]);
          });
        });

        // Add the current variable's GACC to the result list
        result.push(gacc);
      });

      // Update the clause pairs state with the result
      setClausePairs(result);
      setClausePairsGenerated(true); // Update clausePairsGenerated state
      setErrorMessage(''); // Clear error message
    } catch (error) {
      setErrorMessage('Error generating clause pairs.');
    }
  };


// Function to evaluate the expression for a given row and variable values
const evaluateExpression = (expr, row) => {
    let expressionCopy = expr;
  
    // Replace variables with their respective values in the row
    vars.forEach((variable, index) => {
      const value = row[variable] ? 1 : 0;
      expressionCopy = expressionCopy.replaceAll(variable, value);
    });
  
    // Replace equivalence operator (=) with equality check
    expressionCopy = expressionCopy.replaceAll('=', '==');
    
  
    // Replace logical operators with JavaScript equivalents
    expressionCopy = expressionCopy
      .replaceAll('&', '&&')
      .replaceAll('|', '||')
      .replaceAll('!', '!');
  
    // Evaluate the expression using JavaScript
    return eval(expressionCopy);
  };
  

  // Function to reset all state variables
  const resetState = () => {
    setPredicate('');
    setVars([]);
    setTruthTable([]);
    setClausePairs([]);
    setTruthTableGenerated(false);
    setClausePairsGenerated(false);
    setErrorMessage('');
  };

  return (
    <div className="active-clause-coverage">
      <h2>Active Clause Coverage</h2>
      <input
        type="text"
        value={predicate}
        onChange={handleChange}
        placeholder="Enter predicate equation"
        className="predicate-input"
      />
      <button onClick={generateTruthTable} className="generate-btn">Generate Truth Table</button>
      <button onClick={generateClausePairs} disabled={!truthTableGenerated} className="generate-btn">Generate Clause Pairs</button>
      <button onClick={resetState} className="reset-btn">Reset</button>
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      
      <div className="truth-table">
        <h3>Truth Table</h3>
        <table>
          <thead>
            <tr>
              <th>Row</th>
              {vars.map((variable) => (
                <th key={variable}>{variable}</th>
              ))}
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {truthTable.map((row, index) => (
              <tr key={index}>
                <td>{row['Row No']}</td>
                {vars.map((variable) => (
                  <td key={variable}>{row[variable] ? 1 : 0}</td>
                ))}
                <td>{row['Result'] ? 1 : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  
      <div className="clause-pairs-container">
<div className="clause-pairs">
  <h3>Clause Pairs</h3>
  <table>
    <thead>
      <tr>
        <th>Variable</th>
        <th>Pairs</th>
      </tr>
    </thead>
    <tbody>
      {clausePairs.map((pairList, index) => (
        <tr key={index}>
          <td>{vars[index]}</td>
          <td>
            {pairList.map((pair, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && ", "}
                ({pair[0] + 1}, {pair[1] + 1})
              </React.Fragment>
            ))}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

</div>
    </div>
  );
};

export default ActiveClauseCoverage;
