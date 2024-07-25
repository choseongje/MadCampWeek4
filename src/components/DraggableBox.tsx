"use client";

import React, { useRef, SyntheticEvent } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import { XYCoord } from "dnd-core";
import styles from "../styles/CreatePost.module.css";

const ItemTypes = {
  BOX: "box",
};

interface DraggableBoxProps {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  color?: string;
  text?: string;
  track?: {
    albumImage: string;
    artistName: string;
    trackName: string;
  };
  onMove: (id: number, left: number, top: number) => void;
  onResize: (id: number, width: number, height: number) => void;
  onClick: () => void;
  onTextChange: (id: number, text: string) => void;
  isDraggable?: boolean;
  isResizable?: boolean;
}

interface DragItem {
  id: number;
  left: number;
  top: number;
}

const DraggableBox: React.FC<DraggableBoxProps> = ({
  id,
  left,
  top,
  width,
  height,
  color,
  text,
  track,
  onMove,
  onResize,
  onClick,
  onTextChange,
  isDraggable = true,
  isResizable = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BOX,
    item: { id, left, top },
    canDrag: isDraggable,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem, void>({
    accept: ItemTypes.BOX,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current || !isDraggable) {
        return;
      }
      const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
      const newLeft = Math.round(item.left + delta.x);
      const newTop = Math.round(item.top + delta.y);
      onMove(item.id, newLeft, newTop);
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        left,
        top,
        position: "absolute",
      }}
    >
      <ResizableBox
        width={width}
        height={height}
        onResizeStop={(e: React.SyntheticEvent, data: ResizeCallbackData) => {
          console.log(`Resized: ${id}`, data.size.width, data.size.height); // 디버그 로그 추가
          onResize(id, data.size.width, data.size.height);
        }}
        resizeHandles={isResizable ? ["se"] : []}
        draggableOpts={{ disabled: !isResizable }}
      >
        <div
          style={{
            backgroundColor: color || "white",
            width: "100%",
            height: "100%",
            cursor: isDraggable ? "move" : "default",
            opacity: isDragging ? 0.5 : 1,
            display: 'flex', /* Flexbox를 사용하여 가운데 정렬 설정 */
            flexDirection: 'column', /* 요소들을 세로로 정렬 */
            alignItems: 'center', /* 세로 가운데 정렬 */
            justifyContent: 'center', /* 가로 가운데 정렬 */
            textAlign: 'center', /* 텍스트 가운데 정렬 */
          }}
          className={styles.draggableBox}
          onClick={onClick}
          contentEditable={!track && isDraggable}
          suppressContentEditableWarning={true}
          onBlur={(e) => onTextChange(id, e.currentTarget.textContent || "")}
        >
          {track ? (
            <>
              <img src={track.albumImage} alt={track.trackName} className={styles.albumCover} />
              <div className={styles.trackInfo}>{track.trackName}</div>
              <div className={styles.trackInfo}>{track.artistName}</div>
            </>
          ) : (
            text
          )}
        </div>
      </ResizableBox>
    </div>
  );
};

export default DraggableBox;
