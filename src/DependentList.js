import DependentSelection from "./DependentSelection";
import React, { useState, useEffect } from 'react';

function DependentList(props){

  const [ selectedContacts, setSelectedContacts ] = useState([]);

  //Use useEffect hook that only updates when the selected contacts 
  //changes to make sure the state is correct when being passed to the parent
  useEffect(() => {
    props.onSelectedContactsUpdated(selectedContacts);
  }, [selectedContacts]);

  //Gets the data from the child, and calls the parent function to pass the data up a level
  function contactInfoHandler(contactInfo){
    props.onGetContactInfo(contactInfo);
  }

  //When a contact is selected, push it to the array
  function addContact(contact){

      // Create a new array based on current state:
      let arr = [...selectedContacts];

      // Add item to it
      arr.push(contact);

      // Set state
      setSelectedContacts(arr);
  }

  //When the same contact is selected, remove it from the array
  function removeContact(id){

    let arr = [...selectedContacts];

    for (let i = 0; i < arr.length; i++){
      if (arr[i].id === id){
        arr.splice(i, 1);
        setSelectedContacts(arr);
        break;
      }
  }
}

  function fetchingData(bool){
    props.onFetchingData(bool);
  }

    return (
        <div className="react-eventForm-flex-column">
          {props.dependents.map((dependent) => (
            <DependentSelection 
              onContactInfoHandler = {contactInfoHandler}
              onFetchingData = {fetchingData}
              key={dependent.id}
              id={dependent.contactid}
              name={dependent.firstname + ' ' + dependent.lastname} 
              firstname={dependent.firstname}
              lastname={dependent.lastname}
              disableBtn={props.disableBtn}
              onAddContact={addContact}
              onRemoveContact={removeContact}
            />
          ))}
        </div>
      );
}

export default DependentList;