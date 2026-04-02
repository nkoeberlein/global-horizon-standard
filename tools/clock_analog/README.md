# GHS Analog Clock (Web Visualization)

A browser-based, interactive implementation of the standard GHS analog clock face. This tool provides a real-time visualization of Decimal Time (@Beats) and allows for manual exploration of the planetary timeline.

## Features

-   **Base-10 Dial**: A standard GHS clock face divided into 10 main segments (representing centuries of beats).
-   **Dual-Hand System**: 
    -   **Day Hand**: Large hand indicating the progress of the current 10-hour cycle (1,000 beats total).
    -   **Beat Hand**: Fast-moving inner hand indicating high-resolution beat progress (rotates once per 100 beats).
-   **Live Mode**: Synchronizes automatically with UTC to show the current global pulse.
-   **Manual Mode (Scrubber)**: A linear timeline slider that allows users to travel through the day and see how the analog hands respond to different @Beat timestamps.
-   **Digital Sync**: A persistent digital display showing the precise GHS timestamp (e.g., `@500.00`).

## Visual Logic

The clock face follows the GHS visualization standard:
-   **0**: Midnight / Start of day.
-   **2.5**: Morning / Quarter-day milestone.
-   **5**: Noon / Mid-point.
-   **7.5**: Evening / Three-quarter milestone.

Every "1" on the dial corresponds to **100 @Beats**.

## Technology

-   **SVG**: The clock face and hands are rendered using scalable vector graphics for crispness at any resolution.
-   **Vanilla JS**: Lightweight, zero-dependency logic for time calculation and animation.
-   **CSS Variables**: Themeable design using the GHS "Midnight Blue" aesthetic.

## Usage

Simply open `index.html` in any modern web browser. 

-   Toggle the **Mode** switch to "Manual" to use the **Linear GHS Timeline** slider.
-   The slider allows for sub-beat precision (0.1 step) to observe smooth hand movement.
