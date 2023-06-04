import { createClient } from "graphql-ws";
import { Environment, Network, Observable, RecordSource, Store,  } from "relay-runtime"
import { promisifiedDataFetch } from "./data-fetch"

function fetchQuery(operation, variables) {
  return promisifiedDataFetch("http://127.0.0.1:7877/api/system/graphql/query", {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Credentials": 'true',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  })
}

export let subscriptionClient;

if (typeof window !== 'undefined') {
  const isWss = window.location.protocol === "https:";
  const wsProtocol = isWss ? "wss://" : "ws://"
  subscriptionClient = createClient({
    url: wsProtocol + window.location.host + "/api/system/graphql/query",
  })
}

function fetchOrSubscribe(operation, variables) {
  return Observable.create((sink) => {
    if (!operation.text) {
      return sink.error(new Error('Operation text cannot be empty'));
    }
    return subscriptionClient.subscribe(
      {
        operationName: operation.name,
        query: operation.text,
        variables,
      },
      sink,
    );
  });
}

export const serializeRelayEnvironment = (environment) => {
  return environment.getStore().getSource().toJSON()
}

export const createRelayEnvironment = (records) => {
  return new Environment({
    store: new Store(new RecordSource(records)),
    network: Network.create(fetchQuery, fetchOrSubscribe),
  })
}
