'use client';
import * as React from 'react';
import { motion } from 'motion/react'; // Use the version compatible with React 19

export function Effect({ children, fade = false, slide = false, ...props }) {
    // Simple logic that doesn't require extra local hooks
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
                hidden: {
                    opacity: fade ? 0 : 1,
                    y: slide ? 20 : 0
                },
                visible: {
                    opacity: 1,
                    y: 0
                }
            }}
            transition={{ duration: 0.8 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}