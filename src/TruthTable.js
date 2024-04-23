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
      error: null, // New state to hold error information
    };
    this.handleChange = this.handleChange.bind(this);
    this.generateTruthTable = this.generateTruthTable.bind(this);
    this.handlePredicateCoverage = this.handlePredicateCoverage.bind(this);
    this.handleCombinatorialCoverage = this.handleCombinatorialCoverage.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    if (!value.trim()) {
      this.setState({ predicate: value, error: null, showTruthTable: false });
    } else {
      const invalidChars = value.match(/[^a-zA-Z0-9()&|!^= ]|(?<![a-zA-Z0-9])[0-9]+(?![a-zA-Z0-9])/g);
      if (invalidChars) {
        const errorMessage = `Invalid character(s): ${invalidChars.join(', ')}`;
        this.setState({ predicate: value, error: errorMessage });
      } else {
        this.setState({ predicate: value, error: null });
      }
    }
  }

  generateTruthTable() {
    const { predicate } = this.state;
    const trueRows = [];
    const falseRows = [];

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

  
  render() {
    return (
      <div className="truth-table-container">
        <h2>Enter Predicate:</h2>
        <input
          type="text"
          value={this.state.predicate}
          onChange={this.handleChange}
          placeholder="Enter predicate"
        />
        <button onClick={this.handlePredicateCoverage}>Predicate Coverage</button>
        <button onClick={this.handleCombinatorialCoverage}>Combinatorial Coverage</button>

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