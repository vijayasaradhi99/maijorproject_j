import React from 'react';
import './TruthTable.css';

class TruthTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      predicate: '',
      trueRows: [],
      falseRows: [],
      showTruthTable: true,
      error: null, 
    };
    this.handleChange = this.handleChange.bind(this);
    this.generateTruthTable = this.generateTruthTable.bind(this);
    this.handlePredicateCoverage = this.handlePredicateCoverage.bind(this);
    this.handleCombinatorialCoverage = this.handleCombinatorialCoverage.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  
  handleChange(event) {
    const { value } = event.target;
    if (!value.trim()) {
      this.setState({ predicate: value, error: 'Predicate cannot be empty', showTruthTable: false });
    } else {
      const invalidChars = value.match(/[^a-zA-Z0-9()&|!^= ]/g);
      const invalidVars = value.match(/\b\d+\w*\b/g); // Modified regex to check for variables starting with alphabets and not consisting only of numbers
    if (invalidChars || invalidVars) {
      const errorMessage = Invalid character(s): ${invalidChars ? invalidChars.join(', ') : ''} ${invalidVars ? 'Variables must start with alphabets and not consist only of numbers.' : ''};
      this.setState({ predicate: value, error: errorMessage, showTruthTable: false });
    } else {
      this.setState({ predicate: value, error: null, showTruthTable: false });
    }
    }
  }


  
  generateTruthTable() {
    const { predicate } = this.state;
    if (!predicate.trim()) {
      this.setState({ error: 'Predicate cannot be empty', showTruthTable: false });
      return; // Abort truth table generation
    }
  
    // Check if variables start with alphabets
    const invalidVars = predicate.match(/\b\d+\w*\b/g);
    if (invalidVars) {
      const errorMessage = Variables must start with alphabets: ${invalidVars.join(', ')};
      this.setState({ error: errorMessage, showTruthTable: false });
      return; // Abort truth table generation
    }
  
    const trueRows = [];
    const falseRows = [];
  
    // Check for invalid characters before generating the truth table
    const invalidChars = predicate.match(/[^a-zA-Z0-9()&|!^= ]/g);
    if (invalidChars) {
      const errorMessage = Invalid character(s): ${invalidChars.join(', ')};
      this.setState({ error: errorMessage, showTruthTable: false });
      return; // Abort truth table generation
    }
  
    // Generate all possible combinations of true/false for variables in the predicate
    const variables = this.extractVariables(predicate);
    const numVariables = variables.length;
    const numCombinations = Math.pow(2, numVariables);
  
    try {
      for (let i = 0; i < numCombinations; i++) {
        const row = {};
        for (let j = 0; j < numVariables; j++) {
          const variable = variables[j];
          row[variable] = (i >> j) & 1;
        }
        const result = this.evaluateExpression(predicate, row);
        row['Result'] = result ? 1 : 0;
        if (result) {
          trueRows.push(row);
        } else {
          falseRows.push(row);
        }
      }
  
      this.setState({ trueRows, falseRows, showTruthTable: true, error: null });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  


  handlePredicateCoverage() {
    this.generateTruthTable();
    this.setState({ showTruthTable: false });
  }

  handleCombinatorialCoverage() {
    const { predicate } = this.state;

    if (!predicate.trim()) {
      this.setState({ error: 'Predicate cannot be empty', showTruthTable: false });
      return; // Abort combinatorial coverage generation
    }
  
    // Check for invalid characters before generating combinatorial coverage
    const invalidChars = predicate.match(/[^a-zA-Z0-9()&|!^= ]/g);
    const invalidVars = predicate.match(/\b\d+\b/g);
    if (invalidChars || invalidVars) {
      const errorMessage = Invalid character(s): ${invalidChars ? invalidChars.join(', ') : ''} ${invalidVars ? 'Variables cannot be only numerals.' : ''};
      this.setState({ error: errorMessage, showTruthTable: false });
      return; // Abort combinatorial coverage generation
    }
  
    const rows = [];
  
    // Generate all possible combinations of true/false for variables in the predicate
    const variables = this.extractVariables(predicate);
    const numVariables = variables.length;
    const numCombinations = Math.pow(2, numVariables);
  
    try {
      for (let i = 0; i < numCombinations; i++) {
        const row = {};
        for (let j = 0; j < numVariables; j++) {
          const variable = variables[j];
          row[variable] = (i >> j) & 1;
        }
        const result = this.evaluateExpression(predicate, row);
        row['Result'] = result ? 1 : 0;
        rows.push(row);
      }
  
      this.setState({ trueRows: rows, showTruthTable: true, error: null });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  extractVariables(predicate) {
    return [...new Set(predicate.match(/[a-zA-Z0-9]+/g))];
  }

  evaluateExpression(expression, row) {
    const variables = this.extractVariables(expression);

    // Replace each variable in the expression with its value from the row
    let replacedExpression = expression.replace(/[a-zA-Z0-9]+/g, match => row[match]);

    // Replace equivalence operator (=) with logical AND operator (&&)
    replacedExpression = replacedExpression.replace(/=/g, '===');

    // Evaluate the expression
    try {
      const result = eval(replacedExpression);
      return !!result; // Convert result to boolean
    } catch (error) {
      throw new Error('Error evaluating expression: ' + error.message);
    }
  }

  resetForm() {
    // Reset the form state
    this.setState({
      predicate: '',
      trueRows: [],
      falseRows: [],
      showTruthTable: false,
      error: null
    });
  }
  
  render() {
    return (
      <div className="truth-table-container">
        <h2>Enter Predicate:</h2>
        <input
          type="text"
          value={this.state.predicate}
          onChange={this.handleChange}
          placeholder="Enter predicate"
          className="predicate-input"
        />
        <button onClick={this.handleCombinatorialCoverage} className="coverage-button">Truth Table</button>
        <button onClick={this.handlePredicateCoverage} className="coverage-button">Predicate Coverage</button>
        <button onClick={this.handleCombinatorialCoverage} className="coverage-button">Combinatorial Coverage</button>
        <button onClick={this.resetForm} className="reset-button">Reset</button>

        {this.state.error && <p className="error">{this.state.error}</p>}

        {this.state.showTruthTable && (
          <table className="truth-table">
            <thead>
              <tr>
                {Object.keys(this.state.trueRows[0] || {}).map((key, index) => (
                  <th key={index}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.state.trueRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!this.state.showTruthTable && (
          <div>
            <h3>True</h3>
            <table className="truth-table">
              <thead>
                <tr>
                  {Object.keys(this.state.trueRows[0] || {}).map((key, index) => (
                    <th key={index}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.state.trueRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>False</h3>
            <table className="truth-table">
              <thead>
                <tr>
                  {Object.keys(this.state.falseRows[0] || {}).map((key, index) => (
                    <th key={index}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.state.falseRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default TruthTable;
