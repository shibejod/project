import React, { useEffect, useState } from 'react'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill }
  from 'react-icons/bs'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line }
  from 'recharts';
import './Analysis.css'
const Analysis = () => {
  const [data, setData] = useState(null); // Initialize with null
  const [userCount, setUserCount] = useState(null); // Initialize with null
  const [paymentsByProductCategory, setPaymentsByProductCategory] = useState(); // Initialize with null
  const [paymentsByProductApparelType, setPaymentsByProductApparelType] = useState(); // Initialize with null

  useEffect(() => {
    fetch("http://localhost:4000/payments-by-product-category")
      .then((response) => response.json())
      .then((response) => setPaymentsByProductCategory(response))
      .then(() => console.log("Category",paymentsByProductCategory))
      .catch((error) => console.error('Error fetching product count:', error));
  }, [])

  useEffect(() => {
    fetch("http://localhost:4000/api/payments-by-product-apparel-type")
    .then((response) => response.json())
    .then((response) => setPaymentsByProductApparelType(response))
    .then(() => console.log("Apparel",paymentsByProductApparelType))
    .catch((error) => console.error('Error fetching product count:', error));
  }, [])

  useEffect(() => {
    fetch("http://localhost:4000/productcount")
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch((error) => console.error('Error fetching product count:', error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/usercount")
      .then((response) => response.json())
      .then((result) => setUserCount(result))
      .catch((error) => console.error('Error fetching user count:', error));
  }, []);

  if (data === null || userCount === null) return <div>Loading...</div>; // Handle the loading state

  const apparelId = ["Ethnic", "Casual", "Formal", "Party"]

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>PRODUCTS</h3>
            <BsFillArchiveFill className='card_icon' />
          </div>
          <h1>{data.count}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>CATEGORIES</h3>
            <BsFillGrid3X3GapFill className='card_icon' />
          </div>
          <h1>4</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>CUSTOMERS</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{userCount.count}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>ALERTS</h3>
            <BsFillBellFill className='card_icon' />
          </div>
          <h1>42</h1>
        </div>
      </div>

      <div className='charts'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={paymentsByProductCategory}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalAmount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={paymentsByProductApparelType}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" activeDot={{ r: 8 }} />
            {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
          </LineChart>
        </ResponsiveContainer>

      </div>
    </main>
  )
}

export default Analysis