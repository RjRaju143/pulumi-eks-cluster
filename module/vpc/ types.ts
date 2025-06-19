export type SubnetConfig = {
    name: string;
    cidrBlock: string;
    az: string;
};

export type Subnets = {
    public: SubnetConfig[];
    private: SubnetConfig[];
};
