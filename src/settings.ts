export const settings = {
    MONGO_URI: process.env.mongoURI || "mongodb://0.0.0.0:27017",
    JWT_SECRET: process.env.JWT_SECRET || "123",
    JWT_REFRESH_SECRET: process.env.JWT_SECRET || "125",
    EMAILPASS: 'aqjnpnwnyienhrvz'

}
export const whiteList: { accessToken: string, refreshToken: string } = {
    accessToken: '',
    refreshToken: ''
}
