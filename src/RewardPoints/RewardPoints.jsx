import React, { Component } from "react";

const months = ["December", "January", "February"];
const transactionsPerCustomer = [];

class RewardAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerInfo: {}
    };
  }

  componentDidMount() {
    fetch("./transactions.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Work with JSON data
        this.loadCustomerInfo(data);
      })
      .catch((err) => {
        // Do something for an error here
      });
  }

  // Loads customer info 
  // Creates an object with customer no and transactions per month as property.
  loadCustomerInfo = (customerDetails) => {
    customerDetails?.profile?.customers?.forEach((customer) => {
      transactionsPerCustomer.push({
        customer_no: customer.number,
        transPerMonth: this.calculateDollarsPerMonth(customer)
      });
    });
    this.setState({ customerInfo: transactionsPerCustomer });
  };

  // Calculate dollars per month 
  // Returns an object with month and points for every transaction.
  calculateDollarsPerMonth = (customer) => {
    let trans = [];
    months.forEach((month) => {
      trans.push({
        month,
        points: customer.period
          .find((ele) => ele.month === month)
          ?.transactions?.map((trans) =>
            this.calculatePointsPerDollar(trans.dollars)
          )
      });
    });
    return trans;
  };

  // Calculate points per dollar per customer
  calculatePointsPerDollar = (dollar) => {
    let points = 0;
    if (dollar > 100) {
      points = (dollar - 100) * 2;
    }
    if (dollar > 50) {
      points = points + 50;
    }
    return points;
  };

  render() {
    const { customerInfo } = this.state;
    let totalCount;
    return (
      <div>
        {Object.values(customerInfo).map((ele, index) => {
          if (index === ele.customer_no) {
            totalCount = [];
            ele.transPerMonth.forEach((tr) => {
              totalCount.push(
                tr?.points?.reduce((prev, current) => prev + current) || 0
              );
            });
          }
          const monthlyTotalPerCustomer = totalCount.reduce(
            (pre, cur) => pre + cur
          );
          return (
            <div key={index}>
              <h4>
              <label for="customerNo">Customer No : </label>{ele.customer_no}
              </h4>
              <h4>
              <label for="totalPerMonth">Total per month : </label>{monthlyTotalPerCustomer}
              </h4>
              <table
                style={{ marginLeft: "25px", width: 500, border: "1px solid" }}
              >
                <thead>
                  <tr>
                    {ele?.transPerMonth?.map((trans, index) => (
                      <th style={{ border: "1px solid" }} key={index}>
                        {trans?.month}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {ele.transPerMonth.map((trans, index) => (
                      <td style={{ border: "1px solid" }} key={index}>
                        {trans?.points?.reduce(
                          (prev, current) => prev + current
                        ) || 0}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    );
  }
}

export default RewardAmount;
