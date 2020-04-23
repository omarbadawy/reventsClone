import React, { Component } from 'react';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';
import cuid from 'cuid';

import { createEvent, updateEvent } from '../eventsActions';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';

const category = [
    { key: 'drinks', text: 'Drinks', value: 'drinks' },
    { key: 'culture', text: 'Culture', value: 'culture' },
    { key: 'film', text: 'Film', value: 'film' },
    { key: 'food', text: 'Food', value: 'food' },
    { key: 'music', text: 'Music', value: 'music' },
    { key: 'travel', text: 'Travel', value: 'travel' },
];

class EventForm extends Component {
    onFormSubmit = (values) => {
        if (this.props.initialValues.id) {
            this.props.updateEvent(values);
            this.props.history.push(`/events/${this.props.initialValues.id}`);
        } else {
            const newEvent = {
                ...values,
                id: cuid(),
                hostPhotoURL: '/assets/user.png',
                hostedBy: 'Bob',
            };
            this.props.createEvent(newEvent);
            this.props.history.push(`/events/${newEvent.id}`);
        }
    };

    render() {
        const { history, initialValues, invalid, submitting, pristine } = this.props;
        return (
            <Grid>
                <Grid.Column width={10}>
                    <Segment>
                        <Header sub color="teal" content="Event Details" />
                        <Form
                            onSubmit={this.props.handleSubmit(this.onFormSubmit)}
                            autoComplete="off"
                        >
                            <Field
                                name="title"
                                component={TextInput}
                                placeholder="Give your event a name"
                            />
                            <Field
                                name="category"
                                component={SelectInput}
                                options={category}
                                placeholder="What is your event about?"
                            />
                            <Field
                                name="description"
                                component={TextArea}
                                rows={3}
                                placeholder="Tell us about your event"
                            />
                            <Header sub color="teal" content="Event Location Details" />
                            <Field name="city" component={TextInput} placeholder="Event City" />
                            <Field name="venue" component={TextInput} placeholder="Event Venue" />
                            <Field name="date" component={TextInput} placeholder="Event Date" />
                            <Button disabled={invalid || submitting || pristine} positive type="submit">
                                Submit
                            </Button>
                            <Button
                                onClick={
                                    initialValues.id
                                        ? () => history.push(`/events/${initialValues.id}`)
                                        : () => history.push('/events')
                                }
                                type="button"
                            >
                                Cancel
                            </Button>
                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const eventId = ownProps.match.params.id;

    let event = {};

    if (eventId && state.events.length) {
        event = state.events.filter((event) => event.id === eventId)[0];
    }
    return {
        initialValues: event,
    };
};

const mapDispatchToProps = {
    createEvent,
    updateEvent,
};

const validate = combineValidators({
    title: isRequired({ message: 'The event title is required' }),
    category: isRequired({ message: 'The category is required' }),
    description: composeValidators(
        isRequired({ message: 'Please enter the description'}),
        hasLengthGreaterThan(4)({message: 'Desctiption needs to be at least 5 characters'})
    )(),
    city: isRequired('city'),
    venue: isRequired('venue')
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(reduxForm({ form: 'eventForm', validate })(EventForm));
