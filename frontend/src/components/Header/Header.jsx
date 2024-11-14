import React, { useEffect, useState } from 'react';
import logo from '../../../public/DecAuction.svg';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ethers } from 'ethers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { useSelector } from 'react-redux';
import { AddressUtils } from '@/utils/AddressUtils';
import ContractJson from '@/../contract.json';
const Header = () => {
  const navigate = useNavigate();
  const useraddress = useSelector((state) => state.address.address);
  const [isPoints, setPoints] = useState({ status: false, points: '',accCHanged: false });



  useEffect(()=>{
    setPoints({ status: false, points: '', accChanged: false });
  },[useraddress])

  async function getPoints() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractAddress = ContractJson.contractAddress;
        const contractABI = ContractJson.abi;
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const points = await contract.returnUserCredibilty(useraddress);
        console.log('User Points:', points.toString());
        console.log(useraddress);
        setPoints({ status: true, points: points.toString() });
      } catch (error) {
        console.error('User denied account access', error);
        return null;
      }
    } else {
      alert('Please install Metamask');
      return null;
    }
  }


  return (
    <div className="min-w-[100vw] h-[69px] fixed border-b-[0.8px] border-solid border-gray-300 bg-white z-10 flex items-center justify-between px-10">
      <div
        className="flex items-center justify-center hover:cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src={logo} alt="Logo" className="w-[50px] h-[50px] mr-3" />
        <div className="text-[#002B5B] font-semibold text-2xl -mt-2">
          DecAuction
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="link"
          onClick={(e) => {
            e.preventDefault();
            navigate('/create-auction');
          }}
        >
          <span className="text-gray-600 hover:text-gray-600 text-base">
            Create Auction
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" className="text-gray-600 text-base">
              Auctions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Button
                  variant="link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/auctions/owning-auctions');
                  }}
                >
                  <span className="text-gray-600 hover:text-gray-600 text-sm">
                    Owning
                  </span>
                </Button>{' '}
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Button
                  variant="link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/auctions');
                  }}
                >
                  <span className="text-gray-600 hover:text-gray-600 text-sm">
                    All
                  </span>
                </Button>{' '}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant="link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/auctions/user-auctions');
                  }}
                >
                  <span className="text-gray-600 hover:text-gray-600 text-sm">
                    Participating
                  </span>
                </Button>{' '}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="link"
          onClick={(e) => {
            e.preventDefault();
            navigate('/profile');
          }}
        >
          <span className="text-gray-600 hover:text-gray-600 text-base">
            Profile
          </span>
        </Button>
        <Badge>
          {useraddress ? AddressUtils(useraddress) : 'No Account connected'}
        </Badge>

        {!isPoints.status && <Button onClick={getPoints}> Points </Button>}
        {isPoints.status && <Badge onClick={getPoints}>{isPoints.points} Points</Badge>}
      </div>
    </div>
  );
};

export default Header;
