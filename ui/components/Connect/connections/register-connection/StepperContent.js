import React, { useEffect, useState } from 'react';
import { ConnectionDetailContent, FinishContent, CredentialDetailContent } from './constants';

import StepperContent from '../../stepper/StepperContentWrapper';
import RJSFWrapper from '../../../MesheryMeshInterface/PatternService/RJSF_wrapper';
import dataFetch from '../../../../lib/data-fetch';
import { FormControl, Select } from '@material-ui/core';

export const ConnectionDetails = ({ handleNext }) => {
  const [schema, setSchema] = useState({});
  const [component, setComponent] = useState({});
  const formRef = React.createRef();

  useEffect(() => {
    registerConnection();
  }, []);

  useEffect(() => {
    ConnectionDetailContent.title = `Connecting to ${component.displayName}`;
  }, [component]);

  const registerConnection = () => {
    const componentMetadata = localStorage.getItem('componentMetadata');
    const componentMetadataObj = JSON.parse(componentMetadata);
    const metadata = JSON.parse(componentMetadataObj.metadata);

    dataFetch(
      '/api/integrations/connections/register',
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          application_data: metadata.model,
          status: 'initialize',
        }),
      },
      (result) => {
        const connectionData = result?.component;
        setComponent(connectionData);
        const schema = connectionData.schema;
        const jsonSchema = JSON.parse(schema);
        setSchema(jsonSchema);
      },
    );
  };

  const handleCallback = () => {
    handleNext();
  };

  return (
    <StepperContent {...ConnectionDetailContent} handleCallback={handleCallback} disabled={false}>
      <RJSFWrapper
        key="register-connection-rjsf-form"
        jsonSchema={schema}
        liveValidate={false}
        formRef={formRef}
      />
    </StepperContent>
  );
};

export const CredentialDetails = ({ handleNext }) => {
  const [schema, setSchema] = useState({});
  const [credential, setCredential] = useState({});
  const [, /*existingConnection*/ setExistingConnection] = useState({});
  const formRef = React.createRef();

  useEffect(() => {
    registerConnection();
    getchExistingCredential();
  }, []);

  useEffect(() => {
    CredentialDetailContent.title = `Credential for ${credential.displayName}`;
  }, [credential]);

  const registerConnection = () => {
    const componentMetadata = localStorage.getItem('componentMetadata');
    const componentMetadataObj = JSON.parse(componentMetadata);
    const metadata = JSON.parse(componentMetadataObj.metadata);

    dataFetch(
      '/api/integrations/connections/register',
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          application_data: metadata.model,
          status: 'initialize',
        }),
      },
      (result) => {
        const credentialData = result?.credential;
        setCredential(credentialData);
        const schema = credentialData.schema;
        const jsonSchema = JSON.parse(schema);
        setSchema(jsonSchema);
      },
    );
  };

  const getchExistingCredential = () => {
    // const componentMetadata = localStorage.getItem('componentMetadata');
    // const componentMetadataObj = JSON.parse(componentMetadata);
    // const metadata = JSON.parse(componentMetadataObj.metadata);

    dataFetch(
      '/api/integrations/credentials',
      {
        method: 'GET',
        credentials: 'include',
        // body: JSON.stringify({
        //   application_data: metadata.model,
        //   status: 'initialize',
        // }),
      },
      (result) => {
        setExistingConnection(result?.credentials);
        // const credentialData = result?.credential;
        // setCredential(credentialData);
        // const schema = credentialData.schema;
        // const jsonSchema = JSON.parse(schema);
        // setSchema(jsonSchema);
      },
    );
  };

  const verifyConnection = () => {
    const componentMetadata = localStorage.getItem('componentMetadata');
    const componentMetadataObj = JSON.parse(componentMetadata);
    const metadata = JSON.parse(componentMetadataObj.metadata);
    // Kind: <available from the component schema received>

    // Name: <name of the connection>

    // Type:  <available from the component schema received>

    // Subtype:  <available from the component schema received>

    // Metadata: this contains whatever user inputted in the RJSF form.

    // Credential Secret: this contains whatever user entered in the RJSF form for credential (empty if credential schema was not received)

    // ID: use the same id as received previously as part of initial API request to get schemas.

    // Status: register

    dataFetch(
      '/api/integrations/connections/register',
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          Kind: metadata.model,
          Name: 'initialize',
          Type: '',
          Subtype: '',
          Metadata: '',
          'Credential Secret': '',
          ID: '',
          Status: '',
        }),
      },
      (result) => {
        console.log('🚀 ~ file: StepperContent.js:170 ~ verifyConnection ~ result:', result);
        // const connectionData = result?.component
        // setComponent(connectionData)
        // const schema = connectionData.schema
        // const jsonSchema = JSON.parse(schema)
        // setSchema(jsonSchema);
      },
    );
  };

  const handleCallback = () => {
    verifyConnection();
    handleNext();
  };

  const cancelCallback = () => {
    // Close Modal
  };

  return (
    <StepperContent
      {...CredentialDetailContent}
      handleCallback={handleCallback}
      cancelCallback={cancelCallback}
      disabled={false}
    >
      <p className={{ paddingLeft: '16px' }}>
        Select an existing credential to use for this connection
      </p>
      <FormControl>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // value={value || 'discovered'}
          // defaultValue={value}
          onClick={(e) => e.stopPropagation()}
          // onChange={() => handleRegisterConnectionModal(tableMeta)}
          // className={classes.statusSelect}
          disableUnderline
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
            MenuListProps: { disablePadding: true },
            PaperProps: { square: true },
          }}
        >
          {/* {existingConnection?.map((a) => console.log(a))} */}
        </Select>
      </FormControl>
      <p style={{ display: 'flex', justifyContent: 'center' }}>-OR-</p>
      <p style={{ paddingLeft: '16px' }}>Configure a new credential to use for this connection</p>
      <RJSFWrapper
        key="register-connection-rjsf-form"
        jsonSchema={schema}
        liveValidate={false}
        formRef={formRef}
      />
      {/* <RJSFWrapper
        key="register-connection-rjsf-form"
        uiSchema={schemaNewCredential.uiSchema}
        jsonSchema={schemaNewCredential.rjsfSchema}
        liveValidate={false}
        formRef={formRef}
      /> */}
    </StepperContent>
  );
};

export const Finish = () => {
  const handleCallback = () => {
    // MOve to step 2
  };

  const cancelCallback = () => {
    // Close Modal
  };

  return (
    <StepperContent
      {...FinishContent}
      handleCallback={handleCallback}
      cancelCallback={cancelCallback}
      disabled={false}
    >
      <p> Details</p>

      <p>[ METADATA FORMATTER OUTPUT HERE ]</p>
      <p>[ METADATA FORMATTER OUTPUT HERE ]</p>
      <p>[ METADATA FORMATTER OUTPUT HERE ]</p>
      <p>[ METADATA FORMATTER OUTPUT HERE ]</p>
    </StepperContent>
  );
};
