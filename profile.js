import {getParamsFromURL, logout, saveOAuth2Info} from './util.js';


let params = getParamsFromURL(location.href);
let ACCESS_TOKEN = "";
let redirect_url = "http://127.0.0.1:5500/index.html";
let logout_button = document.getElementById('logout');
let form = document.getElementById('form')
let file = document.getElementById('files');
let search = document.getElementById("search");
let result = document.getElementById('result');
 
console.log(params);

search.onclick = listFiles;



 
saveOAuth2Info(params, "profile.html", "info");
 
let info = JSON.parse(localStorage.getItem("info"));
ACCESS_TOKEN = info.access_token;

console.log(ACCESS_TOKEN);
//logout_button.onclick = logout(ACCESS_TOKEN, redirect_url);

form.onsubmit = uploadFile;


function uploadFile(e) {
    e.preventDefault();

    console.log(file.files[0]);

    let metaData = {
        name: Date.now() + file.files[0].name,
        mimeType: file.files[0].type,
        parents:["1_KDYQeZnjXkxyQS1u8kQ5E54jNiITHQg"]
    };

    let formDataObject = new FormData();

    formDataObject.append(
        "metadata",
        new Blob([JSON.stringify(metaData)], { type: "application/json" })
    );
    formDataObject.append("file", file.files[0]);

    fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
        {
          method: "POST",
          headers: new Headers({ Authorization: "Bearer " + ACCESS_TOKEN }),
          body: formDataObject,
        }
      )
        .then((res) => {
          return res.json();
        })
        .then(function (val) {
          console.log(val);
          file.value = "";
          alert("file Uploaded")
        });
}

function listFiles(){
    console.log("Folders in history folder");
    searchFolders("",70);
    console.log("Files in Lot history files");
    searchFiles("",70);
}

function searchFiles(q="", pageSize){

    let FOLDER_ID='1_KDYQeZnjXkxyQS1u8kQ5E54jNiITHQg';

    result.innerHTML=''

    fetch(`https://www.googleapis.com/drive/v3/files?q=%27${FOLDER_ID}%27%20in%20parents&pageSize=10&fields=nextPageToken%2C%20files(*)`,
    {
        method: "GET",
        headers: new Headers({ Authorization: "Bearer " + ACCESS_TOKEN }),
    }
    )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var files = data.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log('Name:', file.name);
          console.log('ID:', file.id);
          let id = file.id;


          const existingFileName = file.name;

          const versionMatch = existingFileName.match(/^v(\d+)/);
          let newFileName;
          if (versionMatch) {
            const versionNumber = parseInt(versionMatch[1]);
            const newVersionNumber = versionNumber + 1;
            newFileName = existingFileName.replace(/^v\d+/, `v${newVersionNumber}`);
        } else {
            // If the version number is not present in the file name, append "_v1" to the file name
            const fileExtension = existingFileName.split('.').pop();
            const baseFileName = existingFileName.substr(0, existingFileName.lastIndexOf('.'));
            newFileName = `${baseFileName}_v1.${fileExtension}`;
        }


        var text= "COPY";
        var docDefinition ={
            watermaek:{ text:text, color:'green', opacity:0.3, bold:true, italics:false}
        }

         
          
          result.innerHTML += `
            <tr>
                <td><a target="_blank" href="https://drive.google.com/file/d/${file.id}">${file.name}</a>
                </td>
                <td>${file.mimeType}</td>
                <td>
                    <a target="_blank" href="${file.webViewLink}" id="downloadLink${file.name}" onclick=
                    "if (!${file.capabilities.canDownload}) {
                        event.preventDefault();
                        return false;
                    }
                    "
                    >Download</a>
                    
                </td>


                <td>
                <button onclick="
                fetch('https://www.googleapis.com/drive/v3/files/${id}',{
                    method:'DELETE',
                    headers:new Headers({Authorization:'Bearer ${ACCESS_TOKEN}'}),
                })
                .then((info) => {
                    console.log(info)
                    alert('file is deleted')
                })
                ">Delete</button>
                </td>
                


                <td>
                <button onclick="
                fetch('https://www.googleapis.com/drive/v3/files/${id}?addParents=1LyeQoQQLHH1lCw2lcz9839GD4QxurMy1&removeParents=${file.parents[0]}',{
                    method:'PATCH',
                    headers:new Headers({Authorization:'Bearer ${ACCESS_TOKEN}'}),
                })
                .then((response) => {
                    if (response.ok) {
                      console.log('File moved successfully');
                      alert('File is moved');
                    } else {
                      console.log('Failed to move file:', response.status);
                    }
                  })
                  .catch((error) => {
                    console.log('Error occurred while moving file:', error);
                  });
                ">Move</button>
                </td>


                <td>
                <button onclick="
                fetch('https://www.googleapis.com/drive/v3/files/${id}/copy,{
                    method:'POST',
                    body: JSON.stringify({ name: '${newFileName}', parents: ['1LyeQoQQLHH1lCw2lcz9839GD4QxurMy1'] }),
                    headers:new Headers({Authorization:'Bearer ${ACCESS_TOKEN}', 'Content-Type': 'application/json'}),
                })
                .then((response) => {
                    if (response.ok) {
                      console.log('File copy created successfully');
                      alert('File is created as ${newFileName}');
                    } else {
                      console.log('Failed to create file:', response.status);
                    }
                  })
                  .catch((error) => {
                    console.log('Error occurred while creating file:', error);
                  });
                  
                fetch('https://www.googleapis.com/drive/v3/files/${id}?addParents=1im-NjaHAPHXMqyc9w4i5xxC1N89funYs&removeParents=${file.parents[0]}',{
                    method:'PATCH',
                    headers:new Headers({Authorization:'Bearer ${ACCESS_TOKEN}'}),
                })
                .then((response) => {
                    if (response.ok) {
                      console.log('File moved successfully');
                      alert('File is moved as old name');
                    } else {
                      console.log('Failed to move file:', response.status);
                    }
                  })
                  .catch((error) => {
                    console.log('Error occurred while moving file:', error);
                  });
                ">Re-Edit</button>
                </td>


                <td>
                <button onclick="
                fetch('https://www.googleapis.com/drive/v3/files/1egXwgdQfWI7h_BJabfL44aAQ-0akUdItjb3zi_0oTrc/export?mimeType=application/pdf', {
                    method: 'GET',
                    headers: new Headers({ Authorization: 'Bearer ${ACCESS_TOKEN}' }),
                })
                .then((response) => {
                    let charsReceived = 0;
                    let result = '';
                    const reader = response.body.getReader();
                    console.log(reader);
                });
               
                ">Print</button>
                </td>
            </tr>
            `;

            var link = document.getElementById(`downloadLink${file.name}`);
            // Add your logic to display the file names and IDs in your HTML page
            if(file.capabilities.canDownload){
                link.style.color='blue';
            } else {
                link.style.color='red';
            }


        }
      } else {
        console.log('No files found.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
}

function searchFolders(q="", pageSize){
    result.innerHTML=''

    let FOLDER_ID='1StlcFuGqcNMZFzsdskJjjxUK1kSXARjq';

    //fetch(`https://www.googleapis.com/drive/v3/files?fields=files(*)`,
    fetch(`https://www.googleapis.com/drive/v3/files?q=%27${FOLDER_ID}%27%20in%20parents%20and%20mimeType%3D%27application%2Fvnd.google-apps.folder%27&pageSize=10&fields=nextPageToken%2C%20files(*)`,
    {
        method: "GET",
        headers: new Headers({ Authorization: "Bearer " + ACCESS_TOKEN }),
    }
    )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var files = data.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log('Name:', file.name);
          console.log('ID:', file.id);
          // Add your logic to display the file names and IDs in your HTML page
        }
      } else {
        console.log('No files found.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
}






console.log(params)
