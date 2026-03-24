interface PriceUpdateMessage {
    type: string;
    tstamp: number;
    asset: string;
    last_price: number;
}
