export type BrokerModel = {
    id: number;
    broker_symbol: string;
    broker_name: string;
}

// Factory function to create a new PortfolioModel object
export const createBroker = (): BrokerModel => ({
  id: 0,
  broker_symbol: '',
  broker_name: ''
});