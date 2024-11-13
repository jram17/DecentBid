import { utils, BigNumber } from 'ethers';
const { keccak256, defaultAbiCoder } = utils;

function getHashInWei(decimalValue) {
    const weiValue = BigNumber.from(decimalValue).mul(BigNumber.from("1000000000000000000")); 
    const encoded = defaultAbiCoder.encode(['uint256'], [weiValue]);
    const hash = keccak256(encoded);
    return hash;
}
function getTotalHash(numHash,secretSalt) {
    const encoded = defaultAbiCoder.encode(['bytes32', 'string'], [numHash, secretSalt]);
    const hash= keccak256(encoded);
    return hash;

}

export { getHashInWei , getTotalHash };