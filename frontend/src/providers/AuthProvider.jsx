import React from 'react';
import { useSelector } from 'react-redux';
import blockchain from '../../public/blockchain.png';
const AuthProvider = ({ children }) => {
  const address = useSelector((state) => state.address.address);

  if (!address) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <img
          src={blockchain}
          alt="Connect Icon"
          className="h-[200px] w-[200px]"
        />
        <span className="text-nowrap text-2xl">
          No Account is connected. Connect a MetaMask account.
        </span>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
