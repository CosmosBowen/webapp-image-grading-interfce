import { useState } from "react";

type NumberChooserProps = {
    data: number[];
    onSelect: (num: number) => void;
};

const NumberChooser = ({ data, onSelect }: NumberChooserProps) => {
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

    const handleSelect = (number: number) => {
        setSelectedNumber(number);
        onSelect(number);
    };

    const numbers = Array.from({ length: data.length }, (_, i) => i + 1);
    const rows = [];
    for (let i = 0; i < numbers.length; i += 10) {
        rows.push(numbers.slice(i, i + 10));
    }

    return (
        <table>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        {row.map((number) => (
                            <td className="td-number"
                                key={number}
                                onClick={() => handleSelect(number)}
                                style={selectedNumber === number ? { backgroundColor: "yellow" } : {}}
                            >
                                {number}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default NumberChooser;

// Usage
// const MyComponent = () => {
//     const data = Array(100).fill(0);  // Replace with your actual data
//     const handleSelect = (number) => {
//         console.log(`Selected number: ${number}`);
//         // Add your processing code here
//     };
//     return <NumberChooser data={data} onSelect={handleSelect} />;
// };
