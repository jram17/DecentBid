export const AddressUtils = (apartment_id) => {

    return `${apartment_id.slice(0, 7)}...${apartment_id.slice(-7)}`;
}