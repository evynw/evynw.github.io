if (typeof document.onselectstart != "undefined") {
    document.onselectstart = new Function("return false");
} else {
    document.onmousedown = new Function("return false");
    document.onmouseup = new Function("return true");
}

$(document).ready(function () {
    function iOSVersion() {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            var version = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
            return version.join('.');
        }
    }

    // return int
    // -2 : error
    // -1 : ascending (version1 < version2)
    // 0 : equal (version1 = version 2)
    // 1 : descending (version1 > version2)
    function compareVersions(version1, version2) {
        if (typeof version1 === 'undefined' || typeof version2 === 'undefined') {
            return -2;
        }

        var version1Array = version1.split('.');
        var version2Array = version2.split('.');
        var compareCount = version1Array.length < version2Array.length ? version1Array.length : version2Array.length;
        var i;
        for (i = 0; i < compareCount; i++) {
            var fragVer1 = parseFloat(version1Array[i]);
            var fragVer2 = parseFloat(version2Array[i]);
            if (fragVer1 > fragVer2) {
                return 1;
            } else if (fragVer1 < fragVer2) {
                return -1;
            }
        }

        if (version1Array.length > compareCount && version1Array[i + 1] !== '0') {
            return 1;
        } else if (version2Array.length > compareCount && version2Array[i + 1] !== '0') {
            return -1;
        }

        return 0;
    }

    function isCurrentVersionSupported(currentVersion, minVersion, maxVersion) {
        if (typeof minVersion === 'undefined' && typeof maxVersion === 'undefined') {
            return false;
        }

        var minVersionComparison = (compareVersions(minVersion, currentVersion) === -1 || compareVersions(minVersion, currentVersion) === 0);
        var maxVersionComparison = (compareVersions(currentVersion, maxVersion) === -1 || compareVersions(currentVersion, maxVersion) === 0);

        if (typeof minVersion !== 'undefined' && typeof maxVersion === 'undefined' && minVersionComparison) {
            return true;
        } else if (typeof minVersion === 'undefined' && typeof maxVersion !== 'undefined' && maxVersionComparison) {
            return true;
        }

        return minVersionComparison && maxVersionComparison;
    }

    var dPackage = getParameterByName("p");
    if (!dPackage) {
        $(".package-error").text("This package doesn't seem to exist :(").css("display", "block");
        $(".package-info").css("display", "none");
        $(".package-name").text("Not Found");
        return;
    }

    $.getJSON("packages/" + dPackage + ".json", function (data) {
        document.title = data.name + " by " + data.author;

        // iOS version check
        var currentVersion = iOSVersion();
        var otherVersion = data.otheriOS;
        if (typeof currentVersion === 'undefined' &&
            (typeof data.minOSVersion !== 'undefined' || typeof(data.maxOSVersion) !== 'undefined')) {
            var result = "<strong>Compatible with iOS ";

            if (typeof data.minOSVersion != 'undefined') {
                result += data.minOSVersion;
                result += (typeof data.maxOSVersion != 'undefined') ? " to " + data.maxOSVersion : "";
            } else if (typeof data.maxOSVersion != 'undefined') {
                result += data.maxOSVersion;
            }

            result += ".</strong>";
            $(".version-check").html(result);
            $(".version-check").css("color", "#222");
        } else {
            // Compare versions
            var result = "";
            var supported = isCurrentVersionSupported(currentVersion, data.minOSVersion, data.maxOSVersion);
            if (supported) {
                result += "Your iOS version (" + currentVersion + ") is <strong>compatible</strong> &#x1f607;";
                // $(".version-check").css("color", "green");
                $(".panel-body.version-check").css("background-color", "#52d183");
            } else {
                if (otheriOS == "untested"){
                    result += "<strong>Not confirmed</strong> to work on your iOS version";
                    result += (typeof currentVersion != 'undefined') ? " (" + currentVersion + ")" : "";
                    result += ".";
                    $(".panel-body.version-check").css("background-color", "#ffe02b");
                } else if (otheriOS == "unsupported"){
                    result += "Only compatible with iOS " + data.minOSVersion + " to " + data.maxOSVersion + " &#x1F61F;";
                    $(".panel-body.version-check").css("background-color", "#f9656d");
                }
            }
            $(".version-check").html(result);
        }

        $(".package-name").text(data.name);
        $(".package-desc").html(data.description);
        $(".latest-version").text(data.version);
        $(".package-author").text(" by " + data.author);
        $(".package-dependency").text(data.dependency);

        var cList = $(".changelog-list");
        var changes = data.changelog[data.version];
        for (var i = 0; i < changes.length - 1; i++) {
            cList.append("<div style=\"border-bottom:1px solid #dad8d8;margin-left:-10px;margin-right:-10px;padding-bottom:7px;margin-bottom:7px;\">" + "<div style=\"margin-left:15px;margin-right:15px\">" + changes[i] + "</div>" + "</div>")
        }
        cList.append("<div style=\"margin-left:5px;margin-right:5px\">" + changes[changes.length - 1] + "</div>");
        $(".screenshots-header").click(function () {
            $(".panel-default>.screenshots-header").toggleClass('toggle');
            $(".screenshots").slideToggle(function () {});
        });
        var count = 0;
        var screenshots = data.screenshots;
        var sKeys = Object.keys(screenshots);
        if (jQuery.isEmptyObject(screenshots)) {
            $("#screenshot-tab").hide();
        } else {
            for (var s in sKeys) {
                var screenshot = sKeys[s];
                if (count % 2 === 0) {
                    $(".screenshots").append("<div class=\"subshots\"></div>");
                }
                $(".screenshots .subshots:last-child").append("<div class=\"col-xs-12\"><img class=\"img-responsive\" src=\"screenshots/" + dPackage + "/" + screenshot + "\" title=\"" + screenshots[screenshot] + "\"><p><strong>" + screenshots[screenshot] + "</strong></p><br></div>");
                count += 1;
            }
        }

        $(".fullchangelog-header").click(function () {
            $(".panel-default>.fullchangelog-header").toggleClass('toggle');
            $(".fullchangelog").slideToggle(function () {});
        });
        var latest = data.version;
        var versions = Object.keys(data.changelog).reverse();
        for (var v in versions) {
            var version = versions[v];
            var panel = $("<div class=\"panel-default \"></div>");
            panel.append(" <div class=\"panel-heading\" style=\"text-transform: uppercase; font-size:15px; font-weight:400; color: #6d6d72;\">" + version + "</div>");
            panel.append(" <div class=\"panel-body changelog-list\" style=\"padding:10px;\"></div>");
            if (version === latest) {
                panel.find(".panel-heading").append(" <div class=\"label label-info badge-label latest-version\">Current</div>");
            }
            var changes = data.changelog[version];
            for (var i = 0; i < changes.length - 1; i++) {
                var change = changes[i];
                panel.find(".changelog-list").append("<div style=\"border-bottom:1px solid #dad8d8;margin-left:-10px;margin-right:-10px;padding-bottom:7px;margin-bottom:7px;\">" + "<div style=\"margin-left:15px;margin-right:15px\">" + change + "</div>" + "</div>");
            }
            panel.find(".changelog-list").append("<div style=\"margin-left:5px;margin-right:5px\">" + changes[changes.length - 1] + "</div>");
            $(".package-versions").append(panel);
        }

        var links = data.links;
        var extra = {
            "<img class=\"icon\" src=\"icons/twitter.png\"><span>Find me on Twitter (@ev_ynw)</span>": "https://twitter.com/ev_ynw",
            "<img class=\"icon\" src=\"icons/email.png\"><span>Send me an email</span>": "mailto:ev.ynam.w@gmail.com",
            "<img class=\"icon\" src=\"icons/like.png\"><span>Buy me a &#x1F37A; via <span style=\"font-style:italic;font-weight:bold;\"><span style=\"color:#253b80;\">Pay</span><span style=\"color:#419bd7;\">Pal</strong></span></span>": "https://paypal.me/evynw"
        };
        $.extend(links, extra);
        var lKeys = Object.keys(links);
        for (var l in lKeys) {
            var link = lKeys[l];
            var wrap = $("<a style=\"color:#333;\" href=\"" + links[link] + "\" target=\"_blank\"><li class=\"list-group-item\"></li></a>");
            wrap.find(".list-group-item").append($.parseHTML(link));
            $(".package-buttons .list-group").append(wrap);
        }
    })

    .fail(function () {
        $(".package-error").text("An error occurred while retrieving package info!").css("display", "block");
        $(".package-info").css("display", "none");
        $(".package-name").text("Repository Error");
        return;
    });

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
});