// Existing code for the Wheel of Luck
const sectors = [
    'الكهرباء', 'النفط', 'التعليم العالي', 'التربية',
    'الاعمار والاسكان', 'الاتصالات', 'مجلس الخدمة', 'الشباب والرياضية',
    'رئاسة الوزراء', 'ديوان الرقابة المالية', 'هيئة النزاهة'
];

var data = sectors.map(function(sector) {
    return {
        label: sector,
        value: 1,
        question: "Lorem ipsum dolor sit amet"
    };
});

var padding = { top: 50, right: 0, bottom: 0, left: 0 },
    w = 600 - padding.left - padding.right,
    h = 600 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20();

var svg = d3
    .select("#chart")
    .append("svg")
    .data([data])
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);

var container = svg
    .append("g")
    .attr("class", "chartholder")
    .attr(
        "transform",
        "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
    );

var vis = container.append("g");

var pie = d3.layout
    .pie()
    .sort(null)
    .value(function (d) {
        return 1;
    });

var arc = d3.svg.arc().outerRadius(r);

var arcs = vis
    .selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

arcs
    .append("path")
    .attr("fill", function (d, i) {
        return color(i);
    })
    .attr("d", function (d) {
        return arc(d);
    });

arcs
    .append("text")
    .attr("transform", function (d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return (
            "rotate(" +
            ((d.angle * 180) / Math.PI - 90) +
            ")translate(" +
            (d.outerRadius - 10) +
            ")"
        );
    })
    .attr("text-anchor", "end")
    .text(function (d, i) {
        return data[i].label;
    });

container.on("click", spin);

function spin(d) {
    container.on("click", null);

    if (oldpick.length == data.length) {
        container.on("click", null);
        return;
    }

    var ps = 360 / data.length,
        rng = Math.floor(Math.random() * 3600 + 1440); // Increased the spin range

    rotation = Math.round(rng / ps) * ps;

    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? picked % data.length : picked;

    if (oldpick.indexOf(picked) !== -1) {
        d3.select(this).call(spin);
        return;
    } else {
        oldpick.push(picked);
    }

    rotation += 90 - Math.round(ps / 2);

    vis
        .transition()
        .duration(8000) // Increased duration for a smoother stop
        .attrTween("transform", rotTween)
        .each("end", function () {
            d3.select("#question p").text(data[picked].label);

            if (data[picked].label === 'النفط' || data[picked].label === 'التعليم العالي') {
                d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                    .attr("fill", "yellow");
                d3.select(".slice:nth-child(" + (picked + 1) + ") text")
                    .attr("fill", "red");
                triggerConfetti();
            }

            oldrotation = rotation;
            container.on("click", spin);
        });
}

svg
    .append("g")
    .attr(
        "transform",
        "translate(" +
        (w + padding.left + padding.right) +
        "," +
        (h / 2 + padding.top) +
        ")"
    )
    .append("path")
    .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
    .style({ fill: "red" });

container
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 70)
    .style({ fill: "white", cursor: "pointer", background: "#CCEAF1" });

container
    .append("text")
    .attr("x", 0)
    .attr("y", 8)
    .attr("text-anchor", "middle")
    .text("اضغط هنا")
    .style({ "font-weight": "bold", "font-size": "22px" });

function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
        return "rotate(" + i(t) + ")";
    };
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Countdown Timer
const targetDate = new Date('2024-07-18T00:00:00').getTime();
const daysValue = document.getElementById('days-value');
const hoursValue = document.getElementById('hours-value');
const secondsValue = document.getElementById('seconds-value');

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const seconds = Math.floor((distance % (1000 * 60 * 60)) / 1000);

    daysValue.textContent = days;
    hoursValue.textContent = hours;
    secondsValue.textContent = seconds;

    if (distance < 0) {
        clearInterval(countdownInterval);
        daysValue.textContent = '0';
        hoursValue.textContent = '0';
        secondsValue.textContent = '0';
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();
