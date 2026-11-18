import React, { useState, useEffect } from 'react'
import {Button, Menu, Typography, Avatar} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import {HomeOutlined, MoneyCollectOutlined, BulbOutlined, FundOutlined, MenuOutlined} from '@ant-design/icons';
import icon from '../images/cryptocurrency.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setActiveMenu(screenSize > 800);
  }, [screenSize]);

  const items = [
    {key: '/', icon: <HomeOutlined />, label: 'Home'},
    {key: '/cryptocurrencies', icon: <FundOutlined />, label: 'Cryptocurrencies'},
    {key: '/exchanges', icon: <MoneyCollectOutlined />, label: 'Exchanges'},
    {key: '/news', icon: <BulbOutlined />, label: 'News'},
  ];

  return (
    <div className="nav-container">
        <div className="logo-container">
            <Avatar src={icon} size="large" />
            <Typography.Title level={2} className="logo">
                <Link to="/">CryptoJack</Link>
            </Typography.Title>
            <Button className="menu-control-container" onClick={() => setActiveMenu(!activeMenu)}>
                <MenuOutlined />
            </Button>
        </div>

        {activeMenu && (
          <Menu theme="dark" items={items} onClick={({key}) => { navigate(key); if(screenSize <= 800) setActiveMenu(false); }} />
        )}
    </div>
  )
}

export default Navbar
