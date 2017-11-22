import React, { Component } from 'react';
import PropTypes from 'prop-types';

const fetchJsonPushes = () =>
  fetch(
    'https://hg.mozilla.org/mozilla-central/json-pushes?version=2&full=1',
    { Accept: 'application/json' },
  );

const Cset = ({ author, node }) => (
  <tr>
    <td>{author}</td>
    <td>{node}</td>
  </tr>
);


Cset.propTypes = {
  author: PropTypes.string.isRequired,
  node: PropTypes.string.isRequired,
};


const Csets = ({ csets }) => (
  <table>
    <tr>
      <th>Author</th>
      <th>Node</th>
    </tr>
    {csets.map(cset => (
      <Cset
        {...cset}
        key={cset.node}
      />
    ))}
  </table>
);

Csets.propTypes = {
  csets: PropTypes.arrayOf(PropTypes.string).isRequired,
};

class ChangesetsViewerContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changesets: [],
    };
  }

  componentDidMount() {
    this.fetchPushes();
  }

  async fetchPushes() {
    const text = await (await fetchJsonPushes()).json();
    const { pushes } = text;
    const pushIds = Object.keys(pushes).reverse();
    const newCsets = pushIds.reduce((allCsets, pushId) => (
      pushes[pushId].changesets.reduce((csets, cset) => (
        csets.concat(cset)
      ), allCsets)
    ), []);
    this.setState({
      changesets: newCsets,
    });
  }

  render() {
    const { changesets } = this.state;

    return (changesets.length !== 0) && (
      <div>
        <Csets csets={changesets} />
      </div>
    );
  }
}

export default ChangesetsViewerContainer;
