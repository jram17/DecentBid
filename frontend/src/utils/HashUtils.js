import { utils, BigNumber } from 'ethers';
const { keccak256, defaultAbiCoder, parseUnits } = utils;

function getHashInWei(decimalValue) {
    const weiValue = parseUnits(decimalValue.toString(), 18);
    const encoded = defaultAbiCoder.encode(['uint256'], [weiValue]);
    const hash = keccak256(encoded);
    return hash;
}

function getTotalHash(numHash, secretSalt) {
    const encoded = defaultAbiCoder.encode(['bytes32', 'string'], [numHash, secretSalt]);
    const hash = keccak256(encoded);
    return hash;
}



export { getHashInWei, getTotalHash };