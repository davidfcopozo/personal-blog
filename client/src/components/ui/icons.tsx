"use client";

type LogoIconProps = {
    color?: string;
    width?: string;
    height?: string;
};


export const LogoIcon = ({ color, width, height }: LogoIconProps) => {
    return (
        <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" width={width ? width : "100"}
            height={height ? height : "100"} fill={`${color ? color : "#00000"}`}>
            <title>TechyComm Logo</title>
            <g id="Layer 2">
                <path id="Path 1" className="s0" d="m690.5 639.1c-2.2 0.6-5.4 1.8-7 2.9-1.6 1-4 3.6-5.1 5.7-1.2 2.1-3.1 7.8-4.2 12.8-1.1 5-2.5 11.7-3.1 15-0.6 3.3-2 10.5-3.1 16-1 5.5-3.7 19.9-5.9 32-2.2 12.1-6.3 33.5-9.1 47.5-2.8 14-5.4 28.4-5.7 32-0.3 3.8-0.1 8.1 0.6 10.2 0.8 2.9 2.1 4.3 5.4 6 4.2 2.3 4.4 2.3 51.2 2.3 46.7 0 47 0 51.8-2.3 3.3-1.6 5.4-3.4 7.1-6.5 1.4-2.3 3.2-7.1 4-10.7 0.9-3.6 3.4-16.2 5.6-28 2.3-11.8 5-25.8 6-31 1.1-5.2 3.1-15.8 4.5-23.5 1.4-7.7 3.9-21.2 5.6-30 1.6-8.8 3.7-20 4.6-25 0.8-5 1.4-11.1 1.2-13.6-0.3-2.8-1.2-5.5-2.4-6.9-1.1-1.2-3.4-2.9-5-3.9-2.6-1.4-8.3-1.6-48-1.8-26.5-0.1-46.6 0.3-49 0.8zm282-0.4c-1.1 0.2-3.9 1-6.2 1.8-3 1.1-5.2 2.8-7.3 5.7-2.1 3-3.7 7.1-5 13.3-1.1 5-3.7 18.2-5.9 29.5-2.2 11.3-5.6 29.3-7.6 40-1.9 10.7-4.9 26.7-6.6 35.5-1.6 8.8-5 26.6-7.5 39.5-2.4 12.9-5.3 28-6.4 33.5-1.1 5.5-2.9 15.4-4 22-1.1 6.6-4.7 26.4-8 44-3.3 17.6-6.7 35.6-7.5 40-0.8 4.4-3 16.3-4.9 26.5-1.9 10.2-4.4 23.9-5.6 30.5-1.1 6.6-3.9 21.5-6 33-2.2 11.5-6.7 35.4-9.9 53-3.3 17.6-7.1 38.7-8.6 47-1.5 8.2-3.7 20.4-5 27-1.4 6.6-3.6 18.7-5 27-1.5 8.2-4 21.7-5.6 30-1.6 8.2-4.3 22.9-6 32.5-1.6 9.6-4.1 23.1-5.4 30-1.4 6.9-2.9 15-3.5 18-0.5 3-2.6 14.2-4.5 24.7-1.9 10.6-3.5 21.9-3.5 25 0 4 0.6 6.8 2 9 1.3 2.1 3.4 3.8 5.8 4.5 2.7 1 15.4 1.3 48.7 1.3 24.8 0 46.7-0.3 48.8-0.8 2-0.4 5.1-1.9 6.8-3.5 1.8-1.5 4.1-4.5 5.2-6.7 1-2.2 3-9.6 4.3-16.5 1.3-6.9 4.6-24.7 7.4-39.5 2.8-14.8 5.5-29.5 6-32.5 0.6-3 2.8-15 5-26.5 2.2-11.5 5.1-27.5 6.5-35.5 1.3-8 3.6-20.3 5-27.5 1.3-7.2 3.8-20.7 5.6-30 1.7-9.3 4.6-24.9 6.4-34.5 1.9-9.6 4.8-25.6 6.5-35.5 1.7-9.9 4-22.5 5.1-28 1.1-5.5 4-20.8 6.3-34 2.4-13.2 6.3-33.9 8.5-46 2.3-12.1 5-27 6.2-33 1.1-6 3.3-18.2 5-27 1.6-8.8 3.9-21.2 5-27.5 1.1-6.3 2.9-15.9 4-21.3 1-5.3 3-12.3 4.4-15.5 1.5-3.1 4.5-7.6 6.8-10 2.4-2.4 6.5-5.2 9.7-6.5l5.5-2.2c245.5-1 247.1-1 251.5-3.1 2.5-1.1 5.6-3.6 7-5.5 1.3-1.9 3-5.4 3.7-7.9 0.8-2.5 3.9-18 6.9-34.5 3.1-16.5 6.5-34.3 7.5-39.5 1-5.2 3.6-19.4 5.9-31.5 2.2-12.1 4.9-26.6 6-32.3 1.1-5.6 2-12.5 2-15.2 0-2.8-0.6-6.2-1.2-7.6-0.7-1.5-3.1-3.6-5.3-4.8l-4-2.1c-286-0.2-369.9-0.1-371 0.2z" />
                <path id="Shape 1" className="s0" d="m1127 1188.9c1.6-8.1 11.5-14.4 22-14.1l78.7 2.2c10.6 0.3 17.9 7.1 16.4 15.2l-27.9 152.5c-1.6 8.5-11.6 15.1-22.5 14.8l-80.8-2.3c-10.9-0.3-18.3-7.4-16.6-15.9z" />
            </g>
        </svg>
    );
};