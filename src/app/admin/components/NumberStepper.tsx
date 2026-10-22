'use client';

export function NumberStepper({ 
    value, 
    onChange 
}: { 
    value: number, 
    onChange: (val: number) => void 
}) {
    const dec = () => onChange(value - 1);
    const inc = () => onChange(value + 1);
    
    return (
        <div className="stepper-wrap">
            <button className="stepper-btn" onClick={dec}>-</button>
            <input 
                type="number" 
                className="stepper-input" 
                value={value} 
                onChange={(e) => onChange(parseInt(e.target.value) || 0)} 
            />
            <button className="stepper-btn" onClick={inc}>+</button>
        </div>
    );
}
