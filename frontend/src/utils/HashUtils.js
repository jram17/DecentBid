import { utils, BigNumber } from 'ethers';
const { keccak256, defaultAbiCoder } = utils;


function getHashInWei(decimalValue) {
    const weiValue = BigNumber.from((decimalValue * 1e18).toString());

    const encoded = defaultAbiCoder.encode(['uint256'], [weiValue]);

    const hash = keccak256(encoded);
    return hash;
}

export { getHashInWei };