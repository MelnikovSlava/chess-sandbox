/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import Chessground from 'react-chessground';
import 'react-chessground/dist/styles/chessground.css';
import { Chess } from 'chess.js';
import { Modal, Paper } from '@mui/material';
import queen from 'react-chessground/dist/images/pieces/merida/wQ.svg';
import rook from 'react-chessground/dist/images/pieces/merida/wR.svg';
import bishop from 'react-chessground/dist/images/pieces/merida/wB.svg';
import knight from 'react-chessground/dist/images/pieces/merida/wN.svg';

function App() {
  const [chess, setChess] = useState(new Chess());
  const [pendingMove, setPendingMove] = useState<[string, string]>(['', '']);
  const [showPromotion, setShowPromotion] = useState<boolean>(false);
  const [fen, setFen] = useState<string>('');
  const [lastMove, setLastMove] = useState<[string, string]>();

  const onMove = (from: string, to: string) => {
    const moves = chess.moves({ verbose: true });
    for (let i = 0, len = moves.length; i < len; i++) {
      if (moves[i].flags.indexOf('p') !== -1 && moves[i].from === from) {
        setPendingMove([from, to]);
        setShowPromotion(true);
        return;
      }
    }

    const move = chess.move({ from, to, promotion: 'x' });

    if (move) {
      setFen(chess.fen());
      setLastMove([from, to]);
      setTimeout(randomMove, 500);
    }
  };

  const randomMove = () => {
    const moves = chess.moves({ verbose: true });
    const move = moves[Math.floor(Math.random() * moves.length)];
    if (moves.length > 0) {
      chess.move(move.san);
      setFen(chess.fen());
      setLastMove([move.from, move.to]);
    }
  };

  const promotion = (event: any) => {
    const from = pendingMove[0];
    const to = pendingMove[1];
    chess.move({ from, to, promotion: event });
    setFen(chess.fen());
    setLastMove([from, to]);
    setShowPromotion(false);
    setTimeout(randomMove, 500);
  };

  const turnColor = () => {
    return chess.turn() === 'w' ? 'white' : 'black';
  };

  const calcMovable = () => {
    const dests = new Map();

    chess.SQUARES.forEach((square: string) => {
      const moves = chess.moves({ square, verbose: true });
      if (moves.length)
        dests.set(
          square,
          moves.map((m: any) => m.to),
        );
    });

    return {
      free: false,
      dests,
      color: 'white',
    };
  };

  return (
    <div className="flex">
      <Paper className="p-5">
        <Chessground
          turnColor={turnColor()}
          movable={calcMovable()}
          lastMove={lastMove}
          fen={fen}
          onMove={onMove}
        />
      </Paper>

      <Paper className="ml-10">
        <p>Hello</p>
      </Paper>

      {/* promotion */}
      <Modal open={showPromotion} onClose={() => setShowPromotion(false)}>
        <div className="flex cursor-pointer text-center">
          <span role="presentation" onClick={() => promotion('q')}>
            <img src={queen} alt="" style={{ width: 50 }} />
          </span>
          <span role="presentation" onClick={() => promotion('r')}>
            <img src={rook} alt="" style={{ width: 50 }} />
          </span>
          <span role="presentation" onClick={() => promotion('b')}>
            <img src={bishop} alt="" style={{ width: 50 }} />
          </span>
          <span role="presentation" onClick={() => promotion('n')}>
            <img src={knight} alt="" style={{ width: 50 }} />
          </span>
        </div>
      </Modal>
    </div>
  );
}

export default App;
