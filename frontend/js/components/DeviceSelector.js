import React from 'react';
import autobind from 'react-autobind';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import NavStore from 'stores/NavStore';

function getStateFromStore() {
  device: NavStore.getPlayerInfo().device
}

class DeviceSelector extends React.Component {

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      device: '',
      devices: []
    }

    this.getDevices()
  }

  _onChange() {
    this.setState(getStateFromStore());
  }

  componentDidMount() {
    NavStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    NavStore.removeChangeListener(this._onChange);
  }

  getDevices() {
    fetch(`/devices`, {credentials: 'include'})
      .then(res => res.json())
      .then(devices => this.setState({devices}))
      .catch(console.error)
  }

  buildDeviceOption(device) {
    const { name, id } = device;
    return <MenuItem value={id} primaryText={name} />;
  }

  render() {
    return (
      <SelectField onChange={() => {}} value={this.state.device.id} floatingLabel="Select Device">
        {this.state.devices.map(this.buildDeviceOption)}
      </SelectField>
    );
  }
}

export default DeviceSelector;
