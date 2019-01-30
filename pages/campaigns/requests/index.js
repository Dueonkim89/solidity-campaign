import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const requestCount = await campaign.methods.getRequestsCount().call();

    //make multiple requests and retrieve all with promise.all
    const requests = await Promise.all(
      //create array with length of requestCount fill up with undefined and then map
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          //inside map get the requests array from our SC and pass in the index we want.
          return campaign.methods.requests(index).call();
        })
    );
    // prop thread to RequestRow component.
    const approversCount = await campaign.methods.approversCount().call();

    console.log(requests);

    return {
      address: props.query.address,
      requests,
      requestCount,
      approversCount
    };
  }

  renderRow() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          id={index}
          key={index}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Request List</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary style={{ marginBottom: 10 }} floated="right">
              Add Request
            </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRow()}</Body>
        </Table>
        <div>Found {this.props.requestCount} request</div>
      </Layout>
    );
  }
}

export default RequestIndex;
