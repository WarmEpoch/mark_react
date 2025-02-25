import { useState, useRef, useCallback, FC } from "react";
import { ReactNode } from "react";
import "../css/Toggle.css";
import { useEffect } from "react";
import { Layout } from "antd";

const { Content } = Layout;

interface ToggleProps {
    children: ReactNode;
    beforeChange?: (oldIndex: number, newIndex: number) => void;
    afterChange?: (currentIndex: number) => void;
}

interface ToggleItemProps {
    children: ReactNode;
}

export const Toggle: FC<ToggleProps> & { Item: FC<ToggleItemProps> } = ({ 
    children, 
    beforeChange,
    afterChange 
}) => {
    const [state, setState] = useState({
        currentIndex: 0,
        isDragging: false,
        startPosition: 0,
        currentTranslate: 0,
        length: 0
    });
    
    const dragOffset = useRef(0);
    const listRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (listRef.current) {
            const newLength = listRef.current.children.length;
            if(newLength > state.length){
                setState(prev => ({ ...prev, currentIndex: newLength - 1, currentTranslate: (newLength - 1) * -100 }));
                afterChange?.(newLength - 1);
            }else if (state.currentIndex >= newLength) {
                const index = Math.max(0, newLength - 1);
                setState(prev => ({ ...prev, currentIndex: index, currentTranslate: index * -100 }));
                afterChange?.(index);
            }
            setState(prev => ({ ...prev, length: newLength }));
        }
    }, [afterChange, children, state.currentIndex, state.length]);

    const handleDragStart = useCallback((position: number) => {
        if (!listRef.current) return;
        
        const movePercent = state.currentTranslate - (state.currentIndex * -100);
        let predictedIndex = state.currentIndex;
        
        if (Math.abs(movePercent) > 10) {
            predictedIndex = movePercent > 0 
                ? Math.max(state.currentIndex - 1, 0)
                : Math.min(state.currentIndex + 1, listRef.current.children.length - 1);
        }
        
        setState(prev => ({
            ...prev,
            isDragging: true,
            startPosition: position
        }));
        
        dragOffset.current = state.currentIndex * -100;
        beforeChange?.(state.currentIndex, predictedIndex);
    }, [state.currentIndex, state.currentTranslate, beforeChange]);

    const handleDragMove = (position: number) => {
        if (!state.isDragging || !listRef.current) return;
        
        const currentPosition = position;
        const listWidth = listRef.current.scrollWidth / listRef.current.children.length;
        const diff = (currentPosition - state.startPosition) / listWidth * 100;
        const maxTranslate = -((listRef.current.children.length - 1) * 100);
        
        const newTranslate = Math.max(
            Math.min(dragOffset.current + diff, 0),
            maxTranslate
        );
        
        setState(prev => ({ ...prev, currentTranslate: newTranslate }));
    };

    const handleDragEnd = () => {
        if (!state.isDragging || !listRef.current) return;
        
        const movePercent = state.currentTranslate - (state.currentIndex * -100);
        
        let newIndex = state.currentIndex;
        if (Math.abs(movePercent) > 10) {
            newIndex = movePercent > 0 
                ? Math.max(state.currentIndex - 1, 0)
                : Math.min(state.currentIndex + 1, listRef.current.children.length - 1);
            afterChange?.(newIndex);
        }
        
        setState(prev => ({
            ...prev,
            currentIndex: newIndex,
            currentTranslate: newIndex * -100,
            isDragging: false
        }));
    };

    const eventHandlers = {
        touch: {
            onTouchStart: (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX),
            onTouchMove: (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX),
            onTouchEnd: handleDragEnd
        },
        mouse: {
            onMouseDown: (e: React.MouseEvent) => {
                e.preventDefault();
                handleDragStart(e.clientX);
            },
            onMouseMove: (e: React.MouseEvent) => {
                e.preventDefault();
                handleDragMove(e.clientX);
            },
            onMouseUp: handleDragEnd,
            onMouseLeave: () => state.isDragging && handleDragEnd()
        }
    };

    return (
        <Content>
            <div 
                className="toggle-container" 
                {...eventHandlers.touch}
                {...eventHandlers.mouse}
            >
                <section 
                    ref={listRef}
                    className="toggle-list"
                    style={{ 
                        transform: `translate3d(${state.isDragging ? state.currentTranslate : state.currentIndex * -100}%, 0, 0)`,
                        transition: state.isDragging ? 'none' : 'transform 500ms'
                    }}
                >
                    {children}
                </section>
                <section className="toggle-indicator">
                    {Array.from({ length: state.length }).map((_, index) => (
                        <article 
                            key={index}
                            className={`toggle-indicator-item ${state.currentIndex === index ? 'active' : ''}`} 
                            onClick={() => {
                                setState(prev => ({ 
                                    ...prev, 
                                    currentIndex: index,
                                    isDragging: false,  // 确保切换时不是拖拽状态
                                    currentTranslate: index * -100  // 更新位移值
                                }));
                                afterChange?.(index);
                            }}
                        />
                    ))}
                </section>
            </div>
        </Content>
    );
};

Toggle.Item = ({ children }: ToggleItemProps) => {
    return <article className="toggle-item">
        {children}
    </article>
};