// function openTab(evt, tabName) {
//     // Lấy tất cả các phần tử có class="tabcontent" và ẩn chúng
//     var tabcontent = document.getElementsByClassName("tabcontent");
//     for (var i = 0; i < tabcontent.length; i++) {
//         tabcontent[i].style.display = "none";
//     }

//     // Lấy tất cả các phần tử có class="tablinks" và loại bỏ class "active"
//     var tablinks = document.getElementsByClassName("tablinks");
//     for (var i = 0; i < tablinks.length; i++) {
//         tablinks[i].classList.remove("active");
//     }

//     // Hiển thị tab hiện tại và thêm class "active" cho nút mở tab đó
//     document.getElementById(tabName).style.display = "block";
//     evt.currentTarget.classList.add("active");
// }

// // Ẩn tất cả các tabcontent trừ dashboard khi trang được tải
// document.addEventListener("DOMContentLoaded", function() {
//     var tabcontents = document.getElementsByClassName("tabcontent");
//     for (var i = 0; i < tabcontents.length; i++) {
//         if (tabcontents[i].id !== "dashboard") {
//             tabcontents[i].style.display = "none";
//         }
//     }
// });

let tooltip = null;

const calendar = new Calendar('#calendar', {
  dataSource: function({year}) {
    // Load data from GitHub API
    return fetch(`https://api.github.com/search/issues?q=repo:year-calendar/js-year-calendar%20created:${year}-01-01..${year}-12-31`)
      .then(result => result.json())
      .then(result => {
        if (result.items) {
          return result.items.map(r => ({
            startDate: new Date(r.created_at),
            endDate: new Date(r.created_at),
            name: '#' + r.number + ' - ' + r.title,
            details: r.comments + ' comments'
          }));
        }
        
        return [];
      });
  },
  mouseOnDay: function(e) {
    if (e.events.length > 0) {
      var content = '';
                
      for (var i in e.events) {
        content += '<div class="event-tooltip-content">'
          + '<div class="event-name" style="color:' + e.events[i].color + '">' + e.events[i].name + '</div>'
                                      + '<div class="event-details">' + e.events[i].details + '</div>'
          + '</div>';
      }
      
      if (tooltip !== null) {
        tooltip.destroy();
        tooltip = null;
      }
      
      tooltip = tippy(e.element, {
          placement: 'right',
          content: content,
          animateFill: false,
          animation: 'shift-away',
          arrow: true
      });
      tooltip.show();
    }
  },
  mouseOutDay: function() {
    if (tooltip !== null) {
      tooltip.destroy();
      tooltip = null;
    }
  }
});