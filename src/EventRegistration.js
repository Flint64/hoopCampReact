import DependentList from "./DependentList";
import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

/***********************************************************************
* TODO: Do server side validation on submit to handle required fields.
* Also figure out which fields are required
*
* TODO: Allow updating of camper info/contact info for myself and contact info
*
*************************************************************************/

function EventRegistrationForm(props){

    const [ eventName, setEventName ] = useState(null);

    const [ myCamperInfoId, setMyCamperInfoId ] = useState(null);
    const [ dependentCamperInfoId, setDependentCamperInfoId ] = useState(null);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ dependentData, setDependentData ] = useState(null);
    const [ selectedContacts, setSelectedContacts ] = useState([]);
    const [ dependentDetails, setDependentDetails ] = useState(null);
    const [ isLoadingDependentDetails, setIsLoadingDependentDetails ] = useState(false);

    const [ isEditingMyInfo, setIsEditingMyInfo ] = useState(false);
    const [ isEditingDependent, setIsEditingDependent ] = useState(false);
    const [ isAddingDependent, setIsAddingDependent ] = useState(false);
    const [ isRegistering, setIsRegistering ] = useState(false);

    const [ disableRegisterButton, setDisableRegisterButton ] = useState(true);

    //Logged in users info
    const [ myFirstname,             setMyFirstname ] = useState(null);
    const [ myLastname,              setMyLastname ] = useState(null);
    // const [ myBirthday,              setMBirthday ] = useState(null);
    const [ myMedications,           seMedications ] = useState(null);
    const [ myMedicalInfo,           setMMedicalInfo ] = useState(null);
    const [ myEmail,                 setMyEmail ] = useState(null);
    const [ myPhone,                 setPhone ] = useState(null);
    const [ myCity,                  setCity ] = useState(null);
    const [ myState,                 setState ] = useState(null);
    const [ myCountry,               setCountry ] = useState(null);
    const [ myShirtSize,             setShirtSize ] = useState(null);
    const [ myEmergencyContactName,  setEmergencyContactName ] = useState(null);
    const [ myEmergencyContactPhone, setEmergencyContactPhone ] = useState(null);

    const [ myFirstnameStatic,             setMyFirstnameStatic ] = useState(null);
    const [ myLastnameStatic,              setMyLastnameStatic ] = useState(null);
    // const [ myBirthdayStatic,              setMBirthdayStatic ] = useState(null);
    const [ myMedicationsStatic,           seMedicationsStatic ] = useState(null);
    const [ myMedicalInfoStatic,           setMMedicalInfoStatic ] = useState(null);
    const [ myEmailStatic,                 setMyEmailStatic ] = useState(null);
    const [ myPhoneStatic,                 setPhoneStatic ] = useState(null);
    const [ myCityStatic,                  setCityStatic ] = useState(null);
    const [ myStateStatic,                 setStateStatic ] = useState(null);
    const [ myCountryStatic,               setCountryStatic ] = useState(null);
    const [ myShirtSizeStatic,             setShirtSizeStatic ] = useState(null);
    const [ myEmergencyContactNameStatic,  setEmergencyContactNameStatic ] = useState(null);
    const [ myEmergencyContactPhoneStatic, setEmergencyContactPhoneStatic ] = useState(null);
    

    //Dependent Form Data
    const [ dependentFirstname,             setDependentFirstname ] = useState(null);
    const [ dependentLastname,              setDependentLastname ] = useState(null);
    const [ dependentShirtSize,             setDependentShirtSize ] = useState(null);
    const [ dependentEmergencyContactName,  setDependentEmergencyContactName ] = useState(null);
    const [ dependentEmergencyContactPhone, setDependentEmergencyContactPhone ] = useState(null);
    const [ dependentMedications,           setDependentMedications ] = useState(null);
    const [ dependentMedicalConditions,     setDependentMedicalConditions ] = useState(null);


    const [ dependentContactid, setDependentContactId ] = useState(null);

//   Similar to componentDidMount and componentDidUpdate, get data once
  useEffect(() => {
      setEventName(window.sessionStorage.getItem("eventName"));
      setIsLoading(true);
      setDependentData(null);
      setDependentDetails(null)
      setIsLoadingDependentDetails(false);
      setIsEditingDependent(false);
      setIsEditingMyInfo(false);
      setIsAddingDependent(false);
      setIsRegistering(false);

      setDisableRegisterButton(true);

    fetchHouseholdDependents();
    fetchMyCamperInfo();

  }, []);

  //Add another use effect hook that only updates when the selected contacts changes
  //so that the state is updated correctly. This one here is only used to log
  //out the selected contacts in real time.
//   useEffect(() => {
//     console.log(selectedContacts);
//   }, [selectedContacts]);

  return(
    <div>
    { displayMainForm() }
    </div>
);


function fetchHouseholdDependents(){

    //Get the logged in users contact info
    fetch(`https://hoopcamp-dev.azurewebsites.net/contacts/getContactById?contactid=%27${window.sessionStorage.getItem('clientId')}%27`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
    }).then(result => {
        return result.json()
        .then(data => {
            // console.log(data);
            if (data.value[0]){
                setMyFirstname(data.value[0].firstname || '');
                setMyLastname(data.value[0].lastname || '');
                // setMBirthday(data.value[0].);
                setMyEmail(data.value[0].emailaddress1 || '');
                setPhone(data.value[0].telephone1 || '');
                setCity(data.value[0].address1_city || '');
                setState(data.value[0].address1_stateorprovince || '');
                sessionStorage.setItem('householdid', data.value[0]._msnfp_householdid_value);
                // setCountry(data.value[0].);
                // console.log(data.value[0]);
    
                setMyFirstnameStatic(data.value[0].firstname || '');
                setMyLastnameStatic(data.value[0].lastname || '');
                setMyEmailStatic(data.value[0].emailaddress1 || '');
                setPhoneStatic(data.value[0].telephone1 || '');
                setCityStatic(data.value[0].address1_city || '');
                setStateStatic(data.value[0].address1_stateorprovince || '');

                fetchingData(false);
                
    fetch(`https://hoopcamp-dev.azurewebsites.net/contacts/getHouseholdMembersByHouseholdId?householdid=%27${window.sessionStorage.getItem("householdid")}%27`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    })
    .then(result => {
        return result.json()
    .then(data => {

        setIsLoading(false);

        if (!data.value){
            setDependentData("no dependents found");
        } else {

            let filteredDependents = [];
           
            for (let i = 0; i < data.value.length; i++){
                if (data.value[i].contactid !== window.sessionStorage.getItem("clientId")){
                    filteredDependents.push(data.value[i]);
                }
            };
            setDependentData(filteredDependents);     
        }
        setDisableRegisterButton(false);
      })
    })

    .catch(err => {
        // console.log(err);
        setIsLoading(false);
        setDependentData("api error");
    });

            }

        }).catch(err => {console.log(err)});
    });

}

//Get the logged in users camper info
function fetchMyCamperInfo(){
    fetch(`https://hoopcamp-dev.azurewebsites.net/camperinfo/getInfo/?contactid=%27${window.sessionStorage.getItem('clientId')}%27`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    }).then(result => {
        return result.json()
        .then(data => {
            if (data.value[0]){
                console.log(data.value[0]);
                setMyCamperInfoId(data.value[0].crbb4_camperinfoid);
                seMedications(data.value[0].crbb4_medications);
                setMMedicalInfo(data.value[0].crbb4_medical_conditions);
                setShirtSize(data.value[0].crbb4_shirt_size);
                setEmergencyContactName(data.value[0].crbb4_emergencycontact);
                setEmergencyContactPhone(data.value[0].crbb4_emergency_contact_phone);
    
                seMedicationsStatic(data.value[0].crbb4_medications);
                setMMedicalInfoStatic(data.value[0].crbb4_medical_conditions);
                setShirtSizeStatic(data.value[0].crbb4_shirt_size);
                setEmergencyContactNameStatic(data.value[0].crbb4_emergencycontact);
                setEmergencyContactPhoneStatic(data.value[0].crbb4_emergency_contact_phone)
            }
        }).catch(err => {console.log(err)});
    });
}

function displayMainForm(){

    if (isRegistering){
        return (
            displayRegistrationSpiner()
        );
    }

    //Display my data
    if (!isEditingMyInfo){
        return(
            <div>

            <div className="react-eventForm-title">
                <h1>Event Registration</h1>
                <p>{ eventName }</p>
            </div>
            <h2 className="react-eventForm-myself" >Myself</h2>

            <div className="react-eventForm-display-flex">
                <div className="react-eventForm-container">
                    <div className="react-eventForm-topLeft">
                        <label className="react-eventForm-bold"  htmlFor="firstName">First Name</label>
                        <p id="firstName">{myFirstnameStatic}</p>
    
                        <label className="react-eventForm-bold"  htmlFor="lastName">Last Name</label>
                        <p id="lastName">{myLastnameStatic}</p>
                        
                        {/* <label className="react-eventForm-bold"  htmlFor="birthday">Birthday</label>
                        <p id="birthday">{myBirthdayStatic}</p> */}
                    </div>
    
                    <div className="react-eventForm-topRight">
                        <label className="react-eventForm-bold"  htmlFor="email">Email</label>
                        <p id="email">{myEmailStatic}</p>
    
                        <label className="react-eventForm-bold"  htmlFor="phone">Phone</label>
                        <p id="phone">{myPhoneStatic}</p>
                    </div>
    
                    <div className="react-eventForm-bottom">
                        <label className="react-eventForm-bold"  htmlFor="medications">Medications</label>
                        <p id="medications">{myMedicationsStatic}</p>
    
                        <label className="react-eventForm-bold"  htmlFor="medicalInformation">Medical Information</label>
                        <p id="medicalInformation">{myMedicalInfoStatic}</p>
                    </div>
                </div>
    
                <div>
                    <label className="react-eventForm-bold"  htmlFor="city">City</label>
                    <p id="city">{myCityStatic}</p>
    
                    <label className="react-eventForm-bold"  htmlFor="state">State</label>
                    <p id="state">{myStateStatic}</p>
    
                    <label className="react-eventForm-bold"  htmlFor="country">Country</label>
                    <p id="country">{myCountryStatic}</p>
    
                    <label className="react-eventForm-bold"  htmlFor="shirtSize">Shirt Size</label>
                    <p id="shirtSize">{myShirtSizeStatic}</p>
    
                    <label className="react-eventForm-bold"  htmlFor="emergencyContactName">Emergency Contact Name</label>
                    <p id="emergencyContactName">{myEmergencyContactNameStatic}</p>
    
                    <label className="react-eventForm-bold"  htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
                    <p id="emergencyContactPhone">{myEmergencyContactPhoneStatic}</p>
    
                <div className="react-eventForm-wrapper">
                    <button disabled={isLoading} disabled={isEditingDependent} className="react-eventForm-buttons" onClick={onEditPersonalInfo}>Edit Personal Info</button>
                </div>
    
                </div>
            </div>
    
                { (isLoading && !isRegistering) ? displayFetchingDependents() : displayDependentData() }

                { isRegistering ? displayRegistrationSpiner() : null }

                <button disabled={disableRegisterButton} className="react-eventForm-buttons" onClick={registerForEvent} >Register For Event</button>
        </div>
        );
    //If editing the form, display the edit version
    } else {
        return(
    <div>

        <div className="react-eventForm-title">
            <h1>Event Registration</h1>
            <p>Put event name here</p>
        </div>
        <h2 className="react-eventForm-myself" >Myself</h2>

        <div className="react-eventForm-display-flex">
            <div className="react-eventForm-container">
                <div className="react-eventForm-topLeft">
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" value={myFirstname} onChange={myFirstnameChange} className="react-eventForm-input"placeholder="First Name"/>

                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" value={myLastname} onChange={myLastnameChange} className="react-eventForm-input"placeholder="Last Name"/>
                    
                    {/* <label htmlFor="birthday">Birthday</label>
                    <input id="birthday" value={myBirthday} onChange={myBirthdayChange} className="react-eventForm-input"placeholder="Birthday"/> */}
                </div>

                <div className="react-eventForm-topRight">
                    <label htmlFor="email">Email</label>
                    <input id="email" value={myEmail} onChange={myEmailChange} className="react-eventForm-input"placeholder="Email"/>

                    <label htmlFor="phone">Phone</label>
                    <input id="phone" value={myPhone} onChange={myPhoneChange} className="react-eventForm-input"placeholder="Phone"/>
                </div>

                <div className="react-eventForm-bottom">
                    <label htmlFor="medications">Medications</label>
                    <input id="medications" value={myMedications} onChange={myMedicationsChange} className="react-eventForm-input" className="react-eventForm-wide-input" placeholder="Medications"/>

                    <label htmlFor="medicalInformation">Medical Information</label>
                    <textarea id="medicalInformation" value={myMedicalInfo} onChange={myMedicalInfoChange} className="react-eventForm-wide-input" placeholder="Medication Information"/>
                </div>
            </div>

            <div>
                <label htmlFor="city">City</label>
                <input id="city" value={myCity} onChange={myCityChange} className="react-eventForm-input"placeholder="City"></input>

                <label htmlFor="state">State</label>
                <input id="state" value={myState} onChange={myStateChange} className="react-eventForm-input"placeholder="State"></input>

                <label htmlFor="country">Country</label>
                <input id="country" value={myCountry} onChange={myCountryChange} className="react-eventForm-input"placeholder="Country"></input>

                <label htmlFor="shirtSize">Shirt Size</label>
                <input id="shirtSize" value={myShirtSize} onChange={myShirtSizeChange} className="react-eventForm-input"placeholder="Shirt Size"></input>

                <label htmlFor="emergencyContactName">Emergency Contact Name</label>
                <input id="emergencyContactName" value={myEmergencyContactName} onChange={myEmergencyContactNameChange} className="react-eventForm-input"placeholder="Emergency Contact Name"></input>

                <label htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
                <input id="emergencyContactPhone" value={myEmergencyContactPhone} onChange={myEmergencyContactPhoneChange} className="react-eventForm-input"placeholder="Emergency Contact Phone"></input>

            <div className="react-eventForm-wrapper">
                <button className="react-eventForm-buttons react-eventForm-color-green" onClick={onUpdatePersonalInfo}>Update My Info</button>
                <button className="react-eventForm-buttons" onClick={onCancelEditPersonalInfo}>Cancel</button>
            </div>

            </div>
        </div>

            { (isLoading && !isRegistering) ? displayFetchingDependents() : displayDependentData() }

            { isRegistering ? displayRegistrationSpiner() : null }
            
            <button disabled={disableRegisterButton} className="react-eventForm-buttons" onClick={registerForEvent} >Register For Event</button>
    </div>
        );
    }
}

/****************************************************************************************
 * Display Fetching Dependents - Displays "fetching dependents..." placeholder text
 ****************************************************************************************/
  function displayFetchingDependents(){
    return(
            <div className="react-eventForm-centerNoData"> <p>Fetching dependents...</p> </div> 
        );
  }

/****************************************************************************************
 * Render Default Text - Displays something on the right side of the dependents list,
 * be it info for selecting a dependent to edit or the loading spinner when a dependent
 * data is being loaded
****************************************************************************************/  
  function renderDefaultText(){
      if (isLoadingDependentDetails && !dependentDetails){
        return(
            <div>
              <ClipLoader color='rgb(255,177,3)' size={100} />
            </div>
        );
      } else {
          return (
            <div className="react-eventForm-center-vertical">
                <div>
                    <p>Select a dependent to edit</p>
                </div>
            </div>
          );
      }
  }


/****************************************************************************************
 * Fetching Data - Shows/hides the spinner when we are fetching dependent data to edit
****************************************************************************************/
  function fetchingData(bool){
      setIsLoadingDependentDetails(bool);
      setDependentDetails(null);
  }

/****************************************************************************************
 *Get Contact Info - Gets the data from the child dependentList component
****************************************************************************************/
  function getContactInfo(contactInfo){
    // console.log(contactInfo);
    setIsLoadingDependentDetails(false);
    setDependentDetails(contactInfo);
    setDependentFirstname(contactInfo[1].firstname);
    setDependentLastname(contactInfo[1].lastname);
    setDependentContactId(contactInfo[1].contactid);
    
    if (contactInfo[0] !== undefined){
        setDependentCamperInfoId(contactInfo[0].crbb4_camperinfoid);
        setDependentShirtSize(contactInfo[0].crbb4_shirt_size);
        setDependentEmergencyContactName(contactInfo[0].crbb4_emergencycontact);
        setDependentEmergencyContactPhone(contactInfo[0].crbb4_emergency_contact_phone);
        setDependentMedications(contactInfo[0].crbb4_medications);
        setDependentMedicalConditions(contactInfo[0].crbb4_medical_conditions);
    }


    //Disable the register event and add/remove dependent buttons 
    //when we are editing a dependent
    setIsEditingDependent(true);
    setDisableRegisterButton(true);
  };


/****************************************************************************************
* These functions here handle the onChange events for each individual input to allow
* them to be editable and not forced readonly because of react
****************************************************************************************/  
function myFirstnameChange(event)             {setMyFirstname(event.target.value);}
function myLastnameChange(event)              {setMyLastname(event.target.value);}
// function myBirthdayChange(event)              {setMBirthday(event.target.value);}
function myMedicationsChange(event)           {seMedications(event.target.value);}
function myMedicalInfoChange(event)           {setMMedicalInfo(event.target.value);}
function myEmailChange(event)                 {setMyEmail(event.target.value);}
function myPhoneChange(event)                 {setPhone(event.target.value);}
function myCityChange(event)                  {setCity(event.target.value);}
function myStateChange(event)                 {setState(event.target.value);}
function myCountryChange(event)               {setCountry(event.target.value);}
function myShirtSizeChange(event)             {setShirtSize(event.target.value);}
function myEmergencyContactNameChange(event)  {setEmergencyContactName(event.target.value);}
function myEmergencyContactPhoneChange(event) {setEmergencyContactPhone(event.target.value);}

function dependentFirstnameChange(event)             { setDependentFirstname(event.target.value); }
function dependentLastnameChange(event)              { setDependentLastname(event.target.value); }
function dependentShirtSizeChange(event)             { setDependentShirtSize(event.target.value); }
function dependentEmergencyContactNameChange(event)  { setDependentEmergencyContactName(event.target.value); }
function dependentEmergencyContactPhoneChange(event) { setDependentEmergencyContactPhone(event.target.value); }
function dependentMedicationsChange(event)           { setDependentMedications(event.target.value); }
function dependentMedicalConditionsChange(event)     { setDependentMedicalConditions(event.target.value); }
/***************************************************************************************
****************************************************************************************
****************************************************************************************/  

/****************************************************************************************
* Cancel Edit Dependent - Cancels editing of a dependent, clears the dependent deetails,
* removes disabled status of submit buttons
****************************************************************************************/  
function cancelEditDependent(){
    setDependentDetails(null);
    setIsEditingDependent(false);
    setDisableRegisterButton(false);

    if (isAddingDependent){
        setIsAddingDependent(false);
    }
}

/****************************************************************************************
* On Edit Personal Info & On Cancel Edit Personal Info - Renders your info or the personal 
* info edit form depending on if you're editing the data or not
****************************************************************************************/
function onEditPersonalInfo(){
    setIsEditingMyInfo(true);
    setDisableRegisterButton(true);
}

function onCancelEditPersonalInfo(){
    setIsEditingMyInfo(false);
    setDisableRegisterButton(false);

    // Set the state variables used for the edit my info inputs
    // to the static values, which are only used for the 
    // static display of your info, which will only be updated
    // whenever your info has successfully been edited.
    setMyFirstname(myFirstnameStatic);
    setMyLastname(myLastnameStatic);
    // setMBirthday(myBirthdayStatic);
    seMedications(myMedicationsStatic);
    setMMedicalInfo(myMedicalInfoStatic);
    setMyEmail(myEmailStatic);
    setPhone(myPhoneStatic);
    setCity(myCityStatic);
    setState(myStateStatic);
    setCountry(myCountryStatic);
    setShirtSize(myShirtSizeStatic);
    setEmergencyContactName(myEmergencyContactNameStatic);
    setEmergencyContactPhone(myEmergencyContactPhoneStatic);

    
}
/****************************************************************************************/

/****************************************************************************************
* On Update Personal Info - Updates dynamics with the new contact and camper info data
* for the currently logged in user
****************************************************************************************/
function onUpdatePersonalInfo(){

    //Update the contact info
    let contact = {
        address1_city: myCity,
        address1_stateorprovince: myState,
        emailaddress1: myEmail,
        firstname: myFirstname,
        lastname: myLastname,
        address1_telephone1: myPhone,
    }

    fetch(`https://hoopcamp-dev.azurewebsites.net/contacts/updateContact/?contactid=${window.sessionStorage.getItem('clientId')}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contact)
        }).then(result => {
            return result.json()
        }).then(data => {
            fetchHouseholdDependents();
            setIsEditingMyInfo(false);
        }).catch((err) => {console.log(err)});


    //Then, either update or create camper info if we have camperInfoId
    let camperInfo = {
        crbb4_contact_id: sessionStorage.getItem('contactid'),
        crbb4_emergencycontact: myEmergencyContactName,
        crbb4_emergency_contact_phone: myEmergencyContactPhone,
        crbb4_medical_conditions: myMedicalInfo,
        crbb4_medications: myMedications,
        crbb4_shirt_size: myShirtSize
    }

    //Update camper info
    if (myCamperInfoId !== null){
        fetch(`https://hoopcamp-dev.azurewebsites.net/camperinfo/updateCamperinfo/?camperInfoId=${myCamperInfoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(camperInfo)
        }).then(result => {
            return result.json()
        }).then(data => {
            fetchMyCamperInfo();
            setIsEditingMyInfo(false);
        }).catch((err) => {console.log(err)});
        
    //Create camper info
    } else {
    fetch('https://hoopcamp-dev.azurewebsites.net/camperinfo/createCamperInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(camperInfo)
        }).then(result => {
            return result.json()
        }).then(data => {
            fetchMyCamperInfo();
            setIsEditingMyInfo(false);
        }).catch((err) => {console.log(err)});
    }



}

/****************************************************************************************
* On Update Dependent - Updates dynamics with the new contact and camper info data
* for the selected dependent
****************************************************************************************/
function onUpdateDependent(contactid){


    //Update the contact info
    let contact = {
        firstname: dependentFirstname,
        lastname: dependentLastname
    }

    fetch(`https://hoopcamp-dev.azurewebsites.net/contacts/updateDependent/?contactid=${contactid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contact)
        }).then(result => {
            return result.json()
        }).then(data => {
            fetchHouseholdDependents();
            setIsEditingDependent(false);
        }).catch((err) => {console.log(err)});


    //Then, either update or create camper info if we have camperInfoId
    let camperInfo = {
        crbb4_contact_id: dependentContactid,
        crbb4_emergencycontact: dependentEmergencyContactName,
        crbb4_emergency_contact_phone: dependentEmergencyContactPhone,
        crbb4_medical_conditions: dependentMedicalConditions,
        crbb4_medications: dependentMedications,
        crbb4_shirt_size: dependentShirtSize
    }

    //Update camper info
    if (dependentCamperInfoId !== null){
        fetch(`https://hoopcamp-dev.azurewebsites.net/camperinfo/updateCamperinfo/?camperInfoId=${dependentCamperInfoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(camperInfo)
        }).then(result => {
            return result.json()
        }).then(data => {
            fetchMyCamperInfo();
            setIsEditingDependent(false);
        }).catch((err) => {console.log(err)});
        
    //Create camper info
    } else {
    fetch('https://hoopcamp-dev.azurewebsites.net/camperinfo/createCamperInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(camperInfo)
        }).then(result => {
            return result.json()
        }).then(data => {
            fetchMyCamperInfo();
            setIsEditingDependent(false);
        }).catch((err) => {console.log(err)});
    }


}

function deleteDependent(dependentContactid){

    fetchingData(true);
    
    fetch(`https://hoopcamp-dev.azurewebsites.net/contacts/deleteDependent/?contactid=${dependentContactid}&camperInfoId=${dependentCamperInfoId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(result => {
        return result.json()
    }).then(data => {
        fetchHouseholdDependents();
        setIsEditingDependent(false);
        setIsLoadingDependentDetails(false) 
        setDependentDetails(null);
        setDisableRegisterButton(false);
    }).catch((err) => {
        // console.log(err);
        fetchHouseholdDependents();
        setIsEditingDependent(false);
        setIsLoadingDependentDetails(false) 
        setDependentDetails(null);
        setDisableRegisterButton(false);
    });


}

/****************************************************************************************
* On Add Dependent - Change state to show an empty edit dependent form
****************************************************************************************/
function onAddDependent(){
    setDisableRegisterButton(true);
    //Set this to the string of "null" so that it has useless data but isn't empty 
    //to allow the edit form to render
    setDependentDetails("null");

    //We set this to true to get the edit dependent form to display, but 
    //we are actually using this form now to add a new dependent
    setIsEditingDependent(true);
    setIsAddingDependent(true);

    //Reset all of the form data
    setDependentFirstname(null);
    setDependentLastname(null);
    setDependentShirtSize(null);
    setDependentEmergencyContactName(null);
    setDependentEmergencyContactPhone(null);
    setDependentMedications(null);
    setDependentMedicalConditions(null);
}

/****************************************************************************************
* Create New Dependent - Creates a new contact in a household and adds camper info 
****************************************************************************************/
function createNewDependent(){

    setIsAddingDependent(false);
    setIsEditingDependent(false);
    setIsLoading(true);


    let contact = {
        firstname: dependentFirstname,
        lastname: dependentLastname,
        msnfp_householdrelationship: "844060001", //Member
        msnfp_HouseholdId: sessionStorage.getItem('householdid'),
        // msnfp_HouseholdId: "579ea79e-2652-ec11-8c62-000d3a9c3c71" //TODO: Change this to match the id from session storage
    }
    
    let camperInfo = {
            crbb4_contact_id: null,
            crbb4_emergencycontact: dependentEmergencyContactName,
            crbb4_emergency_contact_phone: dependentEmergencyContactPhone,
            crbb4_medical_conditions: dependentMedicalConditions,
            crbb4_medications: dependentMedications,
            crbb4_shirt_size: dependentShirtSize
        }

   fetch ('https://hoopcamp-dev.azurewebsites.net/contacts/createChildInHousehold', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact)
    }).then(result => {
        return result.json()
        .then(data => {
            //Set the camperInfo contact id to the created contact
            camperInfo.crbb4_contact_id = data.contactid;

            //After we have created the new contact, create their camper info
            fetch ('https://hoopcamp-dev.azurewebsites.net/camperinfo/createCamperInfo', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(camperInfo)
            }).then(result => {
                return result.json()
                .then(data => {
                    //Now that both posts are complete, reload the list of dependents                   
                    fetchHouseholdDependents();
                    setIsLoadingDependentDetails(false) 
                    setDependentDetails(null);
                })
            }).catch(err => {console.log(err)});

        })
    }).catch(err => {console.log(err)});
}

function displayEditButtons(){
    return (
        <span>
            <button type="button" className="react-eventForm-buttons react-eventForm-color-green react-eventForm-margin-right" onClick={() => onUpdateDependent(dependentContactid)} >Update Dependent</button>
            <button type="button" className="react-eventForm-buttons react-eventForm-color-crimson" onClick={() => deleteDependent(dependentContactid)} >Delete Dependent</button>
        </span>
    );
}

function displayAddButton(){
    return <button type="button" className="react-eventForm-buttons react-eventForm-color-green react-eventForm-margin-right" onClick={createNewDependent} >Add Dependent</button>
}


/***************************************************************************************
 * Register For Event - Registers you and any selected dependents for the event
****************************************************************************************/
function registerForEvent(){

    //Turn on the loading spinner
    setIsRegistering(true);

    let myInfo = {};
    myInfo.msnfp_firstname = myFirstnameStatic;
    myInfo.msnfp_lastname = myLastnameStatic;
    myInfo.msnfp_contactid = sessionStorage.getItem("clientId");
    myInfo.msnfp_eventid = sessionStorage.getItem('eventId');
    // myInfo.msnfp_eventid = "36cd2ebd-293c-ec11-b6e5-00224828a678";

    fetch('https://hoopcamp-dev.azurewebsites.net/events/registerForEvent', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(myInfo)
    })

    .then(result => {
        return result.json()

    .then(data => {
        console.log(data);
      })
    })

    .catch(err => {
        console.log(err);
    });

    let obj = {};
    selectedContacts.forEach((e) => {
        obj.msnfp_firstname = e.firstname;
        obj.msnfp_lastname = e.lastname;
        obj.msnfp_contactid = e.id;
        myInfo.msnfp_eventid = sessionStorage.getItem('eventId');
        // obj.msnfp_eventid = '36cd2ebd-293c-ec11-b6e5-00224828a678';

        //Register each dependent for the event
    fetch('https://hoopcamp-dev.azurewebsites.net/events/registerForEvent', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(obj)
    })

    .then(result => {
        return result.json()

    .then(data => {
        console.log(data);
      })
    })

    .catch(err => {
        console.log(err);
    });


    });

}

function displayRegistrationSpiner(){
    return(
        <div className="react-eventForm-centerNoData">
            <p>Registering for event...</p>
            <ClipLoader color='rgb(255,177,3)' size={100} />
        </div>
    );
}

function updateSelectedContacts(newSelectedContacts){    
    setSelectedContacts(newSelectedContacts);
}

/***************************************************************************************
 * Display Dependent Edit Form - Displays the form to edit dependent contact & camper
 * info
****************************************************************************************/
  function displayDependentEditForm(){
      return(
          <form>
            <div className="react-eventForm-container">
                <div className="react-eventForm-topLeft">
                    <label htmlFor="dependent_firstName">First Name</label>
                    <input value={dependentFirstname} onChange={dependentFirstnameChange} id="dependent_firstName" className="react-eventForm-input"placeholder="First Name"/>

                    <label htmlFor="dependent_lastName">Last Name</label>
                    <input value={dependentLastname} onChange={dependentLastnameChange} id="dependent_lastName" className="react-eventForm-input"placeholder="Last Name"/>
                    
                    {/* <label htmlFor="dependent_birthday">Birthday</label>
                    <input id="dependent_birthday" className="react-eventForm-input"placeholder="Birthday"/> */}
                </div>

                <div className="react-eventForm-topRight">
                    <label htmlFor="dependent_shirtSize">Shirt Size</label>
                    <input value={dependentShirtSize} onChange={dependentShirtSizeChange} id="dependent_shirtSize" className="react-eventForm-input"placeholder="Shirt Size"/>

                    <label htmlFor="dependent_emergencyContactName">Emergency Contact Name</label>
                    <input value={dependentEmergencyContactName} onChange={dependentEmergencyContactNameChange} id="dependent_emergencyContactName" className="react-eventForm-input"placeholder="Emergency Contact Name"/>

                    <label htmlFor="dependent_emergencyContactPhone">Emergency Contact Phone</label>
                    <input value={dependentEmergencyContactPhone} onChange={dependentEmergencyContactPhoneChange} id="dependent_emergencyContactPhone" className="react-eventForm-input"placeholder="Emergency Contact Phone"/>
                </div>

                <div className="react-eventForm-bottom">
                    <label htmlFor="dependent_medications">Medications</label>
                    <input value={dependentMedications} onChange={dependentMedicationsChange} id="dependent_medications" className="react-eventForm-input" className="react-eventForm-wide-input" placeholder="Medications"/>

                    <label htmlFor="medicalInformation">Medical Information</label>
                    <textarea value={dependentMedicalConditions} onChange={dependentMedicalConditionsChange} id="medicalInformation" className="react-eventForm-wide-input" placeholder="Medication Information"/>
                </div>
            </div>
            {/* Always show */}
            <button onClick={cancelEditDependent} type="button" className="react-eventForm-buttons react-eventForm-margin-right">Cancel</button>

            {/* Show update/delete buttons when editing */}
            { (dependentDetails !== "null" && isEditingDependent) ? displayEditButtons() : null }

            {/* Show when adding dependent */}
            { (dependentDetails === "null" && isEditingDependent) ? displayAddButton() : null }
            
        </form>
      );
  }

/****************************************************************************************
 * Display Dependent Data - Displays the list of dependents and  the corresponding 
 * edit form. Displays an error message or no dependents found depending on the outcome
 * of the fetch request.
 ****************************************************************************************/  
  function displayDependentData(){

    if (isRegistering){
        return (
            <div>
            </div>
        );
    }

      if (dependentData !== null && dependentData !== "no dependents found" && dependentData !== "api error"){
        return(
            <div className="react-eventForm-dependents">
                <div className="react-eventForm-dependentsList">
                <h2>Dependents</h2>

                    <DependentList 
                        onFetchingData = {fetchingData}
                        onGetContactInfo = {getContactInfo}
                        dependents = {dependentData}
                        disableBtn = {disableRegisterButton}
                        onSelectedContactsUpdated = {updateSelectedContacts}
                    />

                    <button disabled={disableRegisterButton} onClick={onAddDependent} className="react-eventForm-buttons">Add Dependent</button>
                </div>

                { dependentDetails ? displayDependentEditForm() : renderDefaultText() }
            </div>
          );
      } else if (dependentData === 'no dependents found'){

        if (isAddingDependent){
            return (
                displayDependentEditForm()
            );
        }

        //If there are no dependents found:
        return (
        <div className="react-eventForm-centerNoData">
            <p>No Dependents found.</p>
            <button className="react-eventForm-buttons" onClick={onAddDependent}>Add Dependent?</button>
        </div>
        );
    } else if (dependentData === 'api error'){
        return (
            <div className="react-eventForm-centerNoData">
                <p>An error occured, please reload the page</p>
        </div>
        );
    } 
  }
}

export default EventRegistrationForm;