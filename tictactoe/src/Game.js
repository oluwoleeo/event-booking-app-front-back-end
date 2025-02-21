import Board from './Board';

import { useState } from "react";

export default function Game(){
    return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <ol>{/*TODO*/}</ol>
          </div>
        </div>
      );
}