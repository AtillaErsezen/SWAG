import React from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';

const Keypad = ({ onKeyPress, onDelete, onSubmit, submitLabel = "Enter" }) => {
    const keys = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['del', 0, 'enter']
    ];

    return (
        <div className="w-full max-w-sm mx-auto bg-slate-gray p-2 rounded-xl shadow-inner">
            <div className="grid grid-cols-3 gap-2">
                {keys.flat().map((key, index) => {
                    if (key === 'del') {
                        return (
                            <motion.button
                                key="del"
                                whileTap={{ scale: 0.9 }}
                                onClick={onDelete}
                                className="col-span-1 h-14 bg-deep-concrete text-app-bg rounded-lg flex items-center justify-center font-bold text-xl shadow-md active:bg-charcoal transition-colors"
                                title="Delete"
                            >
                                <Delete size={24} />
                            </motion.button>
                        );
                    }
                    if (key === 'enter') {
                        return (
                            <motion.button
                                key="enter"
                                whileTap={{ scale: 0.95 }}
                                onClick={onSubmit}
                                className="col-span-1 h-14 bg-safety-orange text-app-bg rounded-lg flex items-center justify-center font-bold text-lg shadow-md active:brightness-90 transition-colors"
                            >
                                {submitLabel}
                            </motion.button>
                        );
                    }
                    return (
                        <motion.button
                            key={key}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onKeyPress(key.toString())}
                            className="col-span-1 h-14 bg-app-bg text-charcoal rounded-lg flex items-center justify-center font-bold text-2xl shadow-md active:bg-gray-200 transition-colors"
                        >
                            {key}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default Keypad;
