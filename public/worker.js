self.addEventListener('push', e => {
    const data = e.data.json();
    console.log(data)
    console.log('Notification Received');
    self.registration.showNotification(data.title, {
        body: data.message,
        //icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Archlinux-icon-crystal-64.svg/1024px-Archlinux-icon-crystal-64.svg.png'
        icon: './Data-Database-icon.png'//'https://icons.iconarchive.com/icons/icons8/ios7/128/Data-Database-Backup-icon.png'
        //''//'./Data-Database-icon.png'//'https://icons.iconarchive.com/icons/icons8/ios7/128/Data-Database-Backup-icon.png'
    });
});
