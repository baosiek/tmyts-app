export const ObvInfo = {
    text: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>On-Balance Volume (OBV) Indicator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }
        h1, h2, h3 {
            color: #333;
        }
        p {
            margin: 10px 0;
        }
        ul {
            margin: 10px 0;
        }
        li {
            margin: 5px 0;
        }
    </style>
</head>
<body>

    <h1>On-Balance Volume (OBV) Indicator</h1>

    <p>The <strong>On-Balance Volume (OBV)</strong> indicator is a technical analysis tool used to measure the cumulative buying and selling pressure in a financial market. It is particularly popular among traders and analysts for identifying potential price movements based on volume changes.</p>

    <h2>Key Features of OBV</h2>
    <ul>
        <li><strong>Volume-Based</strong>: OBV uses volume flow to predict changes in stock price. The idea is that volume precedes price movement; thus, if a stock is seeing an increase in volume without a corresponding price increase, it may indicate that the stock is being accumulated.</li>
        
        <li><strong>Calculation</strong>:
            <ul>
                <li>If the closing price of the current period is <strong>higher</strong> than the previous period, the OBV increases by the volume of the current period.</li>
                <li>If the closing price is <strong>lower</strong>, the OBV decreases by the volume of the current period.</li>
                <li>If the closing price is <strong>unchanged</strong>, the OBV remains the same.</li>
            </ul>
            <p>The formula can be summarized as:</p>
            <ul>
                <li><strong>OBV = Previous OBV + Current Volume</strong> (if the price closes higher)</li>
                <li><strong>OBV = Previous OBV - Current Volume</strong> (if the price closes lower)</li>
                <li><strong>OBV = Previous OBV</strong> (if the price closes unchanged)</li>
            </ul>
        </li>
    </ul>

    <h2>Interpretation</h2>
    <ul>
        <li><strong>Bullish Signals</strong>: An increasing OBV suggests that buying pressure is increasing, which might indicate that the price is likely to rise in the future.</li>
        <li><strong>Bearish Signals</strong>: A decreasing OBV indicates increasing selling pressure, suggesting that the price may fall.</li>
        <li><strong>Divergence</strong>: If the OBV is moving in the opposite direction of the price, it may signal a potential reversal. For example:
            <ul>
                <li>If the price is rising while OBV is falling, it may indicate a weakening trend and a potential price correction.</li>
                <li>Conversely, if the price is falling while OBV is rising, it could indicate accumulation and a potential price reversal to the upside.</li>
            </ul>
        </li>
    </ul>

    <h2>Limitations</h2>
    <ul>
        <li><strong>Volume Manipulation</strong>: In low-volume stocks, OBV can be misleading, as small trades can significantly affect the indicator.</li>
        <li><strong>Lagging Indicator</strong>: Like many technical indicators, OBV is a lagging indicator, which means it may not predict price movements in real-time.</li>
    </ul>

    <h2>Conclusion</h2>
    <p>The OBV indicator is a useful tool for traders looking to understand the relationship between volume and price movement. It can help identify trends and potential reversals, but it’s best used in conjunction with other indicators and analysis techniques to confirm signals and make informed trading decisions.</p>

</body>
</html>
    `
}