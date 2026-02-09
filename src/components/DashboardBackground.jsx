"use client";

import React from 'react';

export default function DashboardBackground() {
    return (
        <video
            autoPlay
            loop
            muted
            playsInline
            className="fixed inset-0 w-full h-full -z-10 object-cover pointer-events-none"
            style={{ opacity: 1 }}
        >
            <source src="/dashboard-bg/Generate_a_short_202602091050_b1afj.mp4" type="video/mp4" />
        </video>
    );
}
