import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, DateField, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { stuffDefineMethod } from '../../api/stuff/StuffCollection.methods';
import { inventoryMedications } from '../../api/inventory/InventoryCollection';

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  medication: {
    type: String,
    allowedValues: inventoryMedications,
    defaultValue: '',
  },
  name: String,
  location: String,
  should_have: Number,
  quantity: Number,
  lot: Number,
  expiration: new Date(),
});

/** Renders the Page for adding stuff. */
class AddInventory extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    // console.log('AddInventory.submit', data);
    const { medication, name, location, should_have, quantity, lot, expiration } = data;
    const owner = Meteor.user().username;
    // console.log(`{ ${name}, ${quantity}, ${condition}, ${owner} }`);
    stuffDefineMethod.call({ medication, name, location, should_have, quantity, lot, expiration, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
          // console.error(error.message);
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
          // console.log('Success');
        }
      });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Add Inventory</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <SelectField name='medication'/>
                <TextField name='name'/>
                <TextField name='location'/>
                <NumField name='should_have' decimal={false}/>
                <NumField name='quantity' decimal={false}/>
                <NumField name='lot' decimal={false}/>
                <DateField name='expiration'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default AddInventory;
