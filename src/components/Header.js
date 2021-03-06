import React, { PureComponent } from 'react'

import { connect, store, dispatch } from '@/redux'

import headerActions, { Header, NavGuard } from '@obsidians/header'
import { actions } from '@obsidians/project'

import { List } from 'immutable'

const networks = List([
  {
    id: 'local',
    group: 'default',
    name: 'Local',
    fullName: 'Local Network',
    icon: 'fas fa-laptop-code',
    notification: 'Switched to <b>Local</b> network.',
  }, {
    id: "ckb-aggron",
    group: "testnet",
    name: "Aggron",
    fullName: "Testnet Aggron",
    icon: "far fa-clouds",
    notification: "Switched to <b>Testnet Aggron</b>.",
  }, {
    id: "ckb-mainnet",
    group: "mainnet",
    name: "Mainnet",
    fullName: "CKB Mainnet",
    icon: "far fa-globe",
    notification: "Switched to <b>CKB Mainnet</b>.",
  }
])


class HeaderWithRedux extends PureComponent {
  componentDidMount () {
    const redux = {
      getState: () => store.getState(),
      dispatch,
    }
    actions.history = this.props.history
    actions.redux = redux
    headerActions.history = this.props.history
    headerActions.redux = redux
    this.navGuard = new NavGuard(this.props.history, redux)
  }

  networkList = networksByGroup => {
    const networkList = []
    const groups = networksByGroup.toJS()
    const keys = Object.keys(groups)
    keys.forEach((key, index) => {
      if (key !== 'default') {
        networkList.push({ header: key })
      }
      const networkGroup = groups[key].sort((b, a) => b.name < a.name ? -1 : 1)
      networkGroup.forEach(network => networkList.push(network))
      if (index !== keys.length - 1) {
        networkList.push({ divider: true })
      }
    })
    return networkList
  }

  render () {
    console.debug('[render] HeaderWithRedux')
    const { projects, contracts, accounts, network } = this.props

    const selectedProject = projects.get('selected')?.toJS() || {}

    const networkGroups = networks.groupBy(n => n.group)
    const networkList = this.networkList(networkGroups)
    const selectedNetwork = networks.find(n => n.id === network) || {}

    const starred = accounts.getIn([network.id, 'accounts'])?.toJS() || []
    const selectedContract = contracts.getIn([network.id, 'selected']) || ''
    const selectedAccount = accounts.getIn([network.id, 'selected']) || ''

    return (
      <Header
        projects={projects.get('local').toJS()}
        selectedProject={selectedProject}
        selectedContract={selectedContract}
        selectedAccount={selectedAccount}
        starred={starred}
        network={selectedNetwork}
        networkList={networkList}
      />
    )
  }
}

export default connect([
  'projects',
  'contracts',
  'accounts',
  'network',
])(HeaderWithRedux)
