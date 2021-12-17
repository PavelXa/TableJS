const tableData = JSON.parse(data);
const $table = document.querySelector('#table');
const tableRows = $table.rows;
const arrangedRows = [];
const ACTIVE_TRUE = 1;
const ACTIVE_FALSE = 0;
const ACTIVE_ALL = 2;
let activeStatus = ACTIVE_ALL;

tableData.forEach(obj => {
    obj.innerRows = [];
    if (obj.parentId === 0) {
        arrangedRows.push(obj);
    }
});

findInnerRows(arrangedRows, tableData);

arrangedRows.forEach(row => {
    addRowInTable(row);
});

function addRowInTable(row) {
    $table.insertAdjacentHTML("beforeend", createRow(row));
    if (row.innerRows.length !== 0) {
        row.innerRows.forEach(innerRow => {
            addRowInTable(innerRow);
        });
    }
}

function findInnerRows(parentRows, allRows) {
    parentRows.forEach(parentRow => {
        const hasInner = addInnerRow(parentRow, allRows);
        if (hasInner) {
            findInnerRows(parentRow.innerRows, allRows);
        }
    });
}

function addInnerRow(parentRow, allRow) {
    const parentId = parentRow.id;
    allRow.forEach(row => {
        if (row.parentId === parentId) {
            parentRow.innerRows.push(row);
        }
    });
    return parentRow.innerRows.length !== 0;
}

function createRow(obj) {
    return `
    <tr style="display: ${obj.parentId === 0 ? '' : 'none'}"  onclick="showOrHideInnerRows(this)">
       <td>${obj.id}</td>
       <td>${obj.parentId}</td>
       <td>${obj.isActive}</td>
       <td>${obj.balance}</td>
       <td>${obj.name}</td>
       <td>${obj.email}</td>
    </tr>
    `;
}

function showOrHideInnerRows(element) {
    const id = element.firstElementChild.innerHTML;

    for (let i in tableRows) {
        let row = tableRows[i];
        let columns = row.children;
        if (columns === undefined) continue;

        let parentId = columns[1].innerHTML;
        if (parentId == id) {
            if (row.style.display === 'none') {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }
}

function filterColumn() {
    let newActiveStatus = activeStatus;
    for (let i in tableRows) {
        if (i === '0') continue;

        let row = tableRows[i];
        let columns = row.children;

        if (columns === undefined) continue;

        let isActive = columns[2].innerHTML;
        if (activeStatus === ACTIVE_ALL) {
            row.style.display = '';
            if (isActive !== 'true') {
                row.style.display = 'none';
            }
            newActiveStatus = ACTIVE_TRUE;
        } else if (activeStatus === ACTIVE_TRUE) {
            if (isActive !== 'false') {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
            newActiveStatus = ACTIVE_FALSE;
        } else if (activeStatus === ACTIVE_FALSE) {
            row.style.display = '';
            newActiveStatus = ACTIVE_ALL;
        }
    }
    activeStatus = newActiveStatus;
}

