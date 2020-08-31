import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className="square"
      onClick={() => props.onClick()}
      style={{ backgroundColor: props.shouldHighlight ? "yellow" : "white" }}
    >
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winningPlayer: squares[a], winningSquares: [a, b, c] };
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i, shouldHighlight = false) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.handleClick(i)}
        shouldHighlight={shouldHighlight}
      />
    );
  }

  render() {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const cols = [];
      for (let j = 0; j < 3; j++) {
        const index = i * 3 + j;
        const shouldHighlight = this.props.highlightedSquares.includes(index);
        cols.push(<>{this.renderSquare(index, shouldHighlight)}</>);
      }
      rows.push(<div className="board-row">{cols}</div>);
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardHistory: [
        {
          squares: Array(9).fill(null),
          player: null,
          move: null,
        },
      ],
      xIsNext: true,
    };
  }

  render() {
    const boardHistory = this.state.boardHistory.slice();
    const winner = calculateWinner(
      this.state.boardHistory.slice(-1)[0].squares
    );
    let status;
    let highlightedSquares = [];
    if (winner) {
      const { winningPlayer, winningSquares } = winner;
      status = "Winner: " + winningPlayer;
      highlightedSquares = winningSquares;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const moves = boardHistory.map((step, move) => {
      const desc = move
        ? `Go to move # ${move} (${step.player} played on row ${step.move[0]}, col ${step.move[1]})`
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.boardHistory.slice(-1)[0].squares}
            handleClick={(i) => this.handleClick(i)}
            highlightedSquares={highlightedSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  handleClick(i) {
    const newSquares = [...this.state.boardHistory.slice(-1)[0].squares];
    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }
    newSquares[i] = this.state.xIsNext ? "X" : "O";
    const newTurn = {
      squares: newSquares,
      player: this.state.xIsNext ? "X" : "O",
      move: [Math.floor(i / 3), i % 3],
    };
    this.setState({
      boardHistory: this.state.boardHistory.concat([newTurn]),
      xIsNext: !this.state.xIsNext,
    });
    console.log(this.state);
  }

  jumpTo(move) {
    const newHistory = this.state.boardHistory.slice(0, move + 1);
    this.setState({
      boardHistory: newHistory,
      xIsNext: newHistory.length % 2,
    });
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
