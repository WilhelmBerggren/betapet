import React, { useRef, useState } from "react";

const words = ["hello", "world", "foo", "bar"];

const Tile: React.FC<{ letter?: string; draggable?: boolean }> = ({ letter, draggable = !!letter }) => {
  return (
    <div
      draggable={draggable}
      onDragStart={(e) => (e.currentTarget.style.opacity = "0.1")}
      onDragEnd={(e) => (e.currentTarget.style.opacity = "1")}
      style={{
        cursor: draggable ? "grab" : "auto",
        border: "1px solid #f1e6df",
        backgroundColor: "rgb(234 210 173)",
        borderRadius: "4px",
        textAlign: "center",
        flex: "0 0 auto",
        fontSize: "1rem",
        width: "1rem",
        height: "1rem",
        padding: "0.2rem",
        fontFamily: '"Times", sans-serif',
      }}
    >
      {letter || ""}
    </div>
  );
};

const Board = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(18, 1.6rem)",
        gridTemplateRows: "repeat(18, 1.6rem)",
        gridAutoFlow: "row",
      }}
    >
      {Array.from({ length: 18 }, () =>
        Array.from({ length: 18 }, (_, i) => <Tile key={i} letter={i % 2 === 0 ? "A" : ""} />)
      )}
    </div>
  );
};

const Hand = () => {
  const [hand, setHand] = useState(["A", "B", undefined, "C", undefined, "D", "E"]);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1.6rem)",
        gridTemplateRows: "1.6rem",
      }}
    >
      {hand.map((letter, index) => (
        <Tile letter={letter} key={index} />
      ))}
    </div>
  );
};

export const Game = () => {
  return (
    <div
      style={{
        backgroundColor: "#db5a4b",
        overflow: "scroll",
        padding: "2rem",
        width: "100%",
        display: "flex",
        justifyItems: "center",
        alignItems: "center",
        flexDirection: "column",
        touchAction: "none",
      }}
    >
      <div
        onPointerMove={(e) => console.log(e)}
        style={{ backgroundColor: "white", borderRadius: "4px", padding: "0.1rem" }}
      >
        <Board />
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "2rem",
          }}
        >
          <Hand />
        </div>
      </div>
    </div>
  );
};
