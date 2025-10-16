import { IInfoDialog } from "../app/interfaces/info-dialog-interface";

export const IndicatorInfo: IInfoDialog[] =
    [
        {
            label: 'obv',
            text: `<!DOCTYPE html>
<html lang="en">
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
        },
        {
            label: 'ad-line',
            text: `<!DOCTYPE html>
<html lang="en">
<body>

    <h1>Accumulation Distribution Line (ADL) Indicator</h1>

    <p>The <strong>Accumulation Distribution Line (ADL)</strong> is a technical analysis indicator used to measure the cumulative flow of money into and out of a security. It combines price and volume to create a single line that provides insights into whether a security is being accumulated (bought) or distributed (sold) over time.</p>

    <h2>Key Features of the Accumulation Distribution Line (ADL)</h2>
    <ul>
        <li><strong>Purpose</strong>: The ADL aims to identify the underlying trend of a security by analyzing the relationship between price movement and volume. It helps traders assess whether the price movement is supported by strong buying or selling pressure.</li>
        
        <li><strong>Calculation</strong>: The ADL is calculated using the following steps:
            <ol>
                <li>Determine the <strong>Money Flow Multiplier</strong>:
                    <pre>Money Flow Multiplier = (Close - Low) - (High - Close) / (High - Low)</pre>
                </li>
                <li>Calculate the <strong>Money Flow Volume</strong>:
                    <pre>Money Flow Volume = Money Flow Multiplier × Volume</pre>
                </li>
                <li>Update the ADL:
                    <pre>ADL = Previous ADL + Money Flow Volume</pre>
                </li>
            </ol>
        </li>
    </ul>

    <h2>Interpretation</h2>
    <ul>
        <li><strong>Bullish Sign</strong>: When the ADL is rising, it indicates that there is more buying pressure (accumulation) than selling pressure. This can suggest potential price increases.</li>
        <li><strong>Bearish Sign</strong>: Conversely, when the ADL is falling, it indicates that selling pressure (distribution) is greater than buying pressure. This may suggest potential price declines.</li>
        <li><strong>Divergence</strong>: Traders often look for divergences between the ADL and the price of the security:
            <ul>
                <li><strong>Positive Divergence</strong>: If the price makes a new low but the ADL makes a higher low, it may indicate potential accumulation and a possible price reversal to the upside.</li>
                <li><strong>Negative Divergence</strong>: If the price makes a new high but the ADL makes a lower high, it could indicate distribution and a possible price reversal to the downside.</li>
            </ul>
        </li>
    </ul>

    <h2>Limitations</h2>
    <ul>
        <li><strong>Lagging Indicator</strong>: The ADL is primarily a lagging indicator, meaning it may not predict price movements in real-time. It can provide confirmation of trends rather than predict new ones.</li>
        <li><strong>Volume Sensitivity</strong>: In low-volume environments, the ADL may not accurately reflect the true buying and selling pressure, making it less effective.</li>
        <li><strong>False Signals</strong>: Like many technical indicators, the ADL can produce false signals, especially during volatile market conditions. It is best used in conjunction with other indicators or analysis techniques for confirmation.</li>
    </ul>

    <h2>Conclusion</h2>
    <p>The Accumulation Distribution Line is a valuable tool for traders looking to understand the underlying supply and demand dynamics of a security. By combining price and volume data, the ADL helps identify potential trends and reversals, making it a useful addition to any technical analysis toolkit. However, as with any indicator, it is important to use the ADL in conjunction with other analysis methods to enhance decision-making.</p>

</body>
</html>`
        },
        {
            label: 'adx',
            text: `
<h1>Average Directional Index (ADX)</h1>
<p>The Average Directional Index (ADX) is a technical analysis tool used to assess the strength of a trend in a financial market. Here's a breakdown of its key components and functionality:</p>

<h2>What is the ADX?</h2>
<ul>
    <li><strong>Purpose:</strong> The ADX measures the strength of a trend, regardless of its direction (up or down). It helps traders identify whether a market is trending or ranging.</li>
    <li><strong>Scale:</strong> The ADX is typically plotted on a scale from 0 to 100.</li>
</ul>

<h2>Components of the ADX</h2>
<ol>
    <li><strong>ADX Line:</strong> 
        <ul>
            <li>Represents the strength of a trend.</li>
            <li>Values above 20 or 25 often indicate a strong trend, while values below suggest a weak or non-trending market.</li>
        </ul>
    </li>
    <li><strong>+DI (Positive Directional Indicator):</strong> 
        <ul>
            <li>Measures upward price movement.</li>
            <li>When +DI is above -DI, it indicates a potential bullish trend.</li>
        </ul>
    </li>
    <li><strong>-DI (Negative Directional Indicator):</strong> 
        <ul>
            <li>Measures downward price movement.</li>
            <li>When -DI is above +DI, it indicates a potential bearish trend.</li>
        </ul>
    </li>
</ol>

<h2>How to Use the ADX</h2>
<ul>
    <li><strong>Identifying Trends:</strong> 
        <ul>
            <li>An ADX reading above 25 typically indicates a strong trend, while readings below 20 suggest a ranging market.</li>
        </ul>
    </li>
    <li><strong>Crossovers:</strong> 
        <ul>
            <li>Traders often look for crossovers between +DI and -DI to identify potential entry and exit points.</li>
        </ul>
    </li>
    <li><strong>Confirmation:</strong> 
        <ul>
            <li>The ADX itself does not indicate the direction of the trend, so it is often used in conjunction with other indicators or price action analysis for confirmation.</li>
        </ul>
    </li>
</ul>

<h2>Limitations</h2>
<ul>
    <li><strong>Lagging Indicator:</strong> The ADX is based on moving averages, which means it can lag behind market movements.</li>
    <li><strong>Not Directional:</strong> While it indicates strength, it does not provide information about the trend's direction.</li>
</ul>

<h2>Conclusion</h2>
<p>The ADX is a valuable tool for traders looking to gauge the strength of market trends and make informed decisions. However, it is most effective when used in conjunction with other analysis techniques.</p>

<p>If you have more specific aspects of the ADX you want to explore, feel free to ask!</p>


You can use this HTML code in a web page to display the information about the ADX indicator. If you need any adjustments or additional details, let me know!
            `
        },
        {
            label: 'aroon',
            text: `
<!DOCTYPE html>
<html lang="en">
<body>

<h1>Aroon Indicator</h1>
<p>The Aroon Indicator is a popular technical analysis tool used to measure the strength and direction of trends in financial markets. 
It was developed by Tushar Chande in 1995 and is particularly useful for identifying potential trend reversals.</p>

<h2>Components of the Aroon Indicator</h2>
<ul>
    <li><strong>Aroon Up</strong>: 
        <p>Measures the number of periods since the highest high within a specified look-back period. 
        A value of 0 to 100 is assigned based on how recent the highest high occurred. 
        A higher Aroon Up value indicates a strong upward trend.</p>
    </li>
    <li><strong>Aroon Down</strong>: 
        <p>Measures the number of periods since the lowest low within the same look-back period. 
        Similar to Aroon Up, it assigns a value between 0 to 100 based on the recency of the lowest low. 
        A higher Aroon Down value indicates a strong downward trend.</p>
    </li>
</ul>

<h2>Calculation</h2>
<ul>
    <li><strong>Look-back Period</strong>: Typically, a period of 14 days is used, but this can be adjusted based on trading strategies.</li>
    <li><strong>Formulas</strong>:
        <ul>
            <li>Aroon Up: 
                <p><code>Aroon Up = (Number of periods since highest high / Look-back period) × 100</code></p>
            </li>
            <li>Aroon Down: 
                <p><code>Aroon Down = (Number of periods since lowest low / Look-back period) × 100</code></p>
            </li>
        </ul>
    </li>
</ul>

<h2>Interpretation</h2>
<ul>
    <li><strong>Trend Strength</strong>:
        <ul>
            <li>Aroon Up > Aroon Down: Indicates a strong upward trend.</li>
            <li>Aroon Down > Aroon Up: Indicates a strong downward trend.</li>
        </ul>
    </li>
    <li><strong>Values Close to 100</strong>: Suggest that a strong trend is present.</li>
    <li><strong>Values Close to 0</strong>: Indicate a weak trend or a potential trend reversal.</li>
</ul>

<h2>Trading Signals</h2>
<ul>
    <li><strong>Bullish Signal</strong>: When Aroon Up crosses above Aroon Down, it may indicate the start of a bullish trend.</li>
    <li><strong>Bearish Signal</strong>: When Aroon Down crosses above Aroon Up, it may indicate the beginning of a bearish trend.</li>
</ul>

<h2>Advantages</h2>
<ul>
    <li><strong>Simplicity</strong>: The Aroon Indicator is easy to calculate and interpret.</li>
    <li><strong>Dual Trend Measurement</strong>: It provides insights into both upward and downward trends, making it versatile for different market conditions.</li>
    <li><strong>Trend Reversal Detection</strong>: It can effectively signal potential reversals, which is critical for traders.</li>
</ul>

<h2>Limitations</h2>
<ul>
    <li><strong>Lagging Indicator</strong>: Like many technical indicators, it may lag behind price movements.</li>
    <li><strong>False Signals</strong>: In choppy or sideways markets, Aroon may give false signals, leading to potential losses.</li>
</ul>

<h2>Conclusion</h2>
<p>The Aroon Indicator is a valuable tool for traders looking to assess the strength and direction of trends in financial markets. 
By analyzing both Aroon Up and Aroon Down values, traders can make more informed decisions about when to enter or exit positions. 
As with any technical indicator, it is often best used in conjunction with other analyses and indicators to confirm signals and improve trading strategies.</p>

</body>
</html>
            `
        }

    ]