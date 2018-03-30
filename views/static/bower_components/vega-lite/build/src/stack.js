"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var aggregate_1 = require("./aggregate");
var channel_1 = require("./channel");
var encoding_1 = require("./encoding");
var fielddef_1 = require("./fielddef");
var log = require("./log");
var mark_1 = require("./mark");
var scale_1 = require("./scale");
var util_1 = require("./util");
var STACK_OFFSET_INDEX = {
    zero: 1,
    center: 1,
    normalize: 1
};
function isStackOffset(s) {
    return !!STACK_OFFSET_INDEX[s];
}
exports.isStackOffset = isStackOffset;
exports.STACKABLE_MARKS = [mark_1.BAR, mark_1.AREA, mark_1.RULE, mark_1.POINT, mark_1.CIRCLE, mark_1.SQUARE, mark_1.LINE, mark_1.TEXT, mark_1.TICK];
exports.STACK_BY_DEFAULT_MARKS = [mark_1.BAR, mark_1.AREA];
function potentialStackedChannel(encoding) {
    var xDef = encoding.x;
    var yDef = encoding.y;
    if (fielddef_1.isFieldDef(xDef) && fielddef_1.isFieldDef(yDef)) {
        if (xDef.type === 'quantitative' && yDef.type === 'quantitative') {
            if (xDef.stack) {
                return 'x';
            }
            else if (yDef.stack) {
                return 'y';
            }
            // if there is no explicit stacking, only apply stack if there is only one aggregate for x or y
            if ((!!xDef.aggregate) !== (!!yDef.aggregate)) {
                return xDef.aggregate ? 'x' : 'y';
            }
        }
        else if (xDef.type === 'quantitative') {
            return 'x';
        }
        else if (yDef.type === 'quantitative') {
            return 'y';
        }
    }
    else if (fielddef_1.isFieldDef(xDef) && xDef.type === 'quantitative') {
        return 'x';
    }
    else if (fielddef_1.isFieldDef(yDef) && yDef.type === 'quantitative') {
        return 'y';
    }
    return undefined;
}
// Note: CompassQL uses this method and only pass in required properties of each argument object.
// If required properties change, make sure to update CompassQL.
function stack(m, encoding, stackConfig) {
    var mark = mark_1.isMarkDef(m) ? m.type : m;
    // Should have stackable mark
    if (!util_1.contains(exports.STACKABLE_MARKS, mark)) {
        return null;
    }
    var fieldChannel = potentialStackedChannel(encoding);
    if (!fieldChannel) {
        return null;
    }
    var stackedFieldDef = encoding[fieldChannel];
    var stackedField = fielddef_1.isStringFieldDef(stackedFieldDef) ? fielddef_1.vgField(stackedFieldDef, {}) : undefined;
    var dimensionChannel = fieldChannel === 'x' ? 'y' : 'x';
    var dimensionDef = encoding[dimensionChannel];
    var dimensionField = fielddef_1.isStringFieldDef(dimensionDef) ? fielddef_1.vgField(dimensionDef, {}) : undefined;
    // Should have grouping level of detail that is different from the dimension field
    var stackBy = channel_1.NONPOSITION_CHANNELS.reduce(function (sc, channel) {
        if (encoding_1.channelHasField(encoding, channel)) {
            var channelDef = encoding[channel];
            (vega_util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (cDef) {
                var fieldDef = fielddef_1.getFieldDef(cDef);
                if (fieldDef.aggregate) {
                    return;
                }
                // Check whether the channel's field is identical to x/y's field or if the channel is a repeat
                var f = fielddef_1.isStringFieldDef(fieldDef) ? fielddef_1.vgField(fieldDef, {}) : undefined;
                if (
                // if fielddef is a repeat, just include it in the stack by
                !f ||
                    // otherwise, the field must be different from x and y fields.
                    (f !== dimensionField && f !== stackedField)) {
                    sc.push({ channel: channel, fieldDef: fieldDef });
                }
            });
        }
        return sc;
    }, []);
    if (stackBy.length === 0) {
        return null;
    }
    // Automatically determine offset
    var offset = undefined;
    if (stackedFieldDef.stack !== undefined) {
        offset = stackedFieldDef.stack;
    }
    else if (util_1.contains(exports.STACK_BY_DEFAULT_MARKS, mark)) {
        // Bar and Area with sum ops are automatically stacked by default
        offset = stackConfig === undefined ? 'zero' : stackConfig;
    }
    else {
        offset = stackConfig;
    }
    if (!offset || !isStackOffset(offset)) {
        return null;
    }
    // If stacked, check scale type if it is linear
    if (stackedFieldDef.scale && stackedFieldDef.scale.type && stackedFieldDef.scale.type !== scale_1.ScaleType.LINEAR) {
        log.warn(log.message.cannotStackNonLinearScale(stackedFieldDef.scale.type));
        return null;
    }
    // Check if it is a ranged mark
    if (encoding_1.channelHasField(encoding, fieldChannel === channel_1.X ? channel_1.X2 : channel_1.Y2)) {
        log.warn(log.message.cannotStackRangedMark(fieldChannel));
        return null;
    }
    // Warn if stacking summative aggregate
    if (stackedFieldDef.aggregate && !util_1.contains(aggregate_1.SUM_OPS, stackedFieldDef.aggregate)) {
        log.warn(log.message.stackNonSummativeAggregate(stackedFieldDef.aggregate));
    }
    return {
        groupbyChannel: dimensionDef ? dimensionChannel : undefined,
        fieldChannel: fieldChannel,
        impute: util_1.contains(['area', 'line'], mark),
        stackBy: stackBy,
        offset: offset
    };
}
exports.stack = stack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBa0M7QUFDbEMseUNBQW9DO0FBQ3BDLHFDQUE4RTtBQUM5RSx1Q0FBcUQ7QUFDckQsdUNBQWlIO0FBQ2pILDJCQUE2QjtBQUM3QiwrQkFBMEc7QUFDMUcsaUNBQWtDO0FBQ2xDLCtCQUFzQztBQUt0QyxJQUFNLGtCQUFrQixHQUFzQjtJQUM1QyxJQUFJLEVBQUUsQ0FBQztJQUNQLE1BQU0sRUFBRSxDQUFDO0lBQ1QsU0FBUyxFQUFFLENBQUM7Q0FDYixDQUFDO0FBRUYsdUJBQThCLENBQVM7SUFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRkQsc0NBRUM7QUEwQlksUUFBQSxlQUFlLEdBQUcsQ0FBQyxVQUFHLEVBQUUsV0FBSSxFQUFFLFdBQUksRUFBRSxZQUFLLEVBQUUsYUFBTSxFQUFFLGFBQU0sRUFBRSxXQUFJLEVBQUUsV0FBSSxFQUFFLFdBQUksQ0FBQyxDQUFDO0FBQzdFLFFBQUEsc0JBQXNCLEdBQUcsQ0FBQyxVQUFHLEVBQUUsV0FBSSxDQUFDLENBQUM7QUFHbEQsaUNBQWlDLFFBQXlCO0lBQ3hELElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDeEIsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUV4QixFQUFFLENBQUMsQ0FBQyxxQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLHFCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssY0FBYyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNqRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENB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QUFDLHFCQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCx1Q0FBdUM7SUFDdkMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLFNBQVMsSUFBSSxDQUFDLGVBQVEsQ0FBQyxtQkFBTyxFQUFFLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxNQUFNLENBQUM7UUFDTCxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUMzRCxZQUFZLGNBQUE7UUFDWixNQUFNLEVBQUUsZUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQztRQUN4QyxPQUFPLFNBQUE7UUFDUCxNQUFNLFFBQUE7S0FDUCxDQUFDO0FBQ0osQ0FBQztBQXZGRCxzQkF1RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge1NVTV9PUFN9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7Tk9OUE9TSVRJT05fQ0hBTk5FTFMsIE5vblBvc2l0aW9uQ2hhbm5lbCwgWCwgWDIsIFkyfSBmcm9tICcuL2NoYW5uZWwnO1xuaW1wb3J0IHtjaGFubmVsSGFzRmllbGQsIEVuY29kaW5nfSBmcm9tICcuL2VuY29kaW5nJztcbmltcG9ydCB7RmllbGQsIEZpZWxkRGVmLCBnZXRGaWVsZERlZiwgaXNGaWVsZERlZiwgaXNTdHJpbmdGaWVsZERlZiwgUG9zaXRpb25GaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi9sb2cnO1xuaW1wb3J0IHtBUkVBLCBCQVIsIENJUkNMRSwgaXNNYXJrRGVmLCBMSU5FLCBNYXJrLCBNYXJrRGVmLCBQT0lOVCwgUlVMRSwgU1FVQVJFLCBURVhULCBUSUNLfSBmcm9tICcuL21hcmsnO1xuaW1wb3J0IHtTY2FsZVR5cGV9IGZyb20gJy4vc2NhbGUnO1xuaW1wb3J0IHtjb250YWlucywgRmxhZ30gZnJvbSAnLi91dGlsJztcblxuXG5leHBvcnQgdHlwZSBTdGFja09mZnNldCA9ICd6ZXJvJyB8ICdjZW50ZXInIHwgJ25vcm1hbGl6ZSc7XG5cbmNvbnN0IFNUQUNLX09GRlNFVF9JTkRFWDogRmxhZzxTdGFja09mZnNldD4gPSB7XG4gIHplcm86IDEsXG4gIGNlbnRlcjogMSxcbiAgbm9ybWFsaXplOiAxXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTdGFja09mZnNldChzOiBzdHJpbmcpOiBzIGlzIFN0YWNrT2Zmc2V0IHtcbiAgcmV0dXJuICEhU1RBQ0tfT0ZGU0VUX0lOREVYW3NdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0YWNrUHJvcGVydGllcyB7XG4gIC8qKiBEaW1lbnNpb24gYXhpcyBvZiB0aGUgc3RhY2suICovXG4gIGdyb3VwYnlDaGFubmVsOiAneCcgfCAneSc7XG5cbiAgLyoqIE1lYXN1cmUgYXhpcyBvZiB0aGUgc3RhY2suICovXG4gIGZpZWxkQ2hhbm5lbDogJ3gnIHwgJ3knO1xuXG4gIC8qKiBTdGFjay1ieSBmaWVsZHMgZS5nLiwgY29sb3IsIGRldGFpbCAqL1xuICBzdGFja0J5OiB7XG4gICAgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sXG4gICAgY2hhbm5lbDogTm9uUG9zaXRpb25DaGFubmVsXG4gIH1bXTtcblxuICAvKipcbiAgICogU2VlIGBcInN0YWNrXCJgIHByb3BlcnR5IG9mIFBvc2l0aW9uIEZpZWxkIERlZi5cbiAgICovXG4gIG9mZnNldDogU3RhY2tPZmZzZXQ7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhpcyBzdGFjayB3aWxsIHByb2R1Y2UgaW1wdXRlIHRyYW5zZm9ybVxuICAgKi9cbiAgaW1wdXRlOiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgU1RBQ0tBQkxFX01BUktTID0gW0JBUiwgQVJFQSwgUlVMRSwgUE9JTlQsIENJUkNMRSwgU1FVQVJFLCBMSU5FLCBURVhULCBUSUNLXTtcbmV4cG9ydCBjb25zdCBTVEFDS19CWV9ERUZBVUxUX01BUktTID0gW0JBUiwgQVJFQV07XG5cblxuZnVuY3Rpb24gcG90ZW50aWFsU3RhY2tlZENoYW5uZWwoZW5jb2Rpbmc6IEVuY29kaW5nPEZpZWxkPik6ICd4JyB8ICd5JyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHhEZWYgPSBlbmNvZGluZy54O1xuICBjb25zdCB5RGVmID0gZW5jb2RpbmcueTtcblxuICBpZiAoaXNGaWVsZERlZih4RGVmKSAmJiBpc0ZpZWxkRGVmKHlEZWYpKSB7XG4gICAgaWYgKHhEZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScgJiYgeURlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJykge1xuICAgICAgaWYgKHhEZWYuc3RhY2spIHtcbiAgICAgICAgcmV0dXJuICd4JztcbiAgICAgIH0gZWxzZSBpZiAoeURlZi5zdGFjaykge1xuICAgICAgICByZXR1cm4gJ3knO1xuICAgICAgfVxuICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gZXhwbGljaXQgc3RhY2tpbmcsIG9ubHkgYXBwbHkgc3RhY2sgaWYgdGhlcmUgaXMgb25seSBvbmUgYWdncmVnYXRlIGZvciB4IG9yIHlcbiAgICAgIGlmICgoISF4RGVmLmFnZ3JlZ2F0ZSkgIT09ICghIXlEZWYuYWdncmVnYXRlKSkge1xuICAgICAgICByZXR1cm4geERlZi5hZ2dyZWdhdGUgPyAneCcgOiAneSc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh4RGVmLnR5cGUgPT09ICdxdWFudGl0YXRpdmUnKSB7XG4gICAgICByZXR1cm4gJ3gnO1xuICAgIH0gZWxzZSBpZiAoeURlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJykge1xuICAgICAgcmV0dXJuICd5JztcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNGaWVsZERlZih4RGVmKSAmJiB4RGVmLnR5cGUgPT09ICdxdWFudGl0YXRpdmUnKSB7XG4gICAgcmV0dXJuICd4JztcbiAgfSBlbHNlIGlmIChpc0ZpZWxkRGVmKHlEZWYpICYmIHlEZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICByZXR1cm4gJ3knO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8vIE5vdGU6IENvbXBhc3NRTCB1c2VzIHRoaXMgbWV0aG9kIGFuZCBvbmx5IHBhc3MgaW4gcmVxdWlyZWQgcHJvcGVydGllcyBvZiBlYWNoIGFyZ3VtZW50IG9iamVjdC5cbi8vIElmIHJlcXVpcmVkIHByb3BlcnRpZXMgY2hhbmdlLCBtYWtlIHN1cmUgdG8gdXBkYXRlIENvbXBhc3NRTC5cbmV4cG9ydCBmdW5jdGlvbiBzdGFjayhtOiBNYXJrIHwgTWFya0RlZiwgZW5jb2Rpbmc6IEVuY29kaW5nPEZpZWxkPiwgc3RhY2tDb25maWc6IFN0YWNrT2Zmc2V0KTogU3RhY2tQcm9wZXJ0aWVzIHtcbiAgY29uc3QgbWFyayA9IGlzTWFya0RlZihtKSA/IG0udHlwZSA6IG07XG4gIC8vIFNob3VsZCBoYXZlIHN0YWNrYWJsZSBtYXJrXG4gIGlmICghY29udGFpbnMoU1RBQ0tBQkxFX01BUktTLCBtYXJrKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZmllbGRDaGFubmVsID0gcG90ZW50aWFsU3RhY2tlZENoYW5uZWwoZW5jb2RpbmcpO1xuICBpZiAoIWZpZWxkQ2hhbm5lbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3Qgc3RhY2tlZEZpZWxkRGVmID0gZW5jb2RpbmdbZmllbGRDaGFubmVsXSBhcyBQb3NpdGlvbkZpZWxkRGVmPHN0cmluZz47XG4gIGNvbnN0IHN0YWNrZWRGaWVsZCA9IGlzU3RyaW5nRmllbGREZWYoc3RhY2tlZEZpZWxkRGVmKSA/IHZnRmllbGQoc3RhY2tlZEZpZWxkRGVmLCB7fSkgOiB1bmRlZmluZWQ7XG5cbiAgY29uc3QgZGltZW5zaW9uQ2hhbm5lbCA9IGZpZWxkQ2hhbm5lbCA9PT0gJ3gnID8gJ3knIDogJ3gnO1xuICBjb25zdCBkaW1lbnNpb25EZWYgPSBlbmNvZGluZ1tkaW1lbnNpb25DaGFubmVsXTtcbiAgY29uc3QgZGltZW5zaW9uRmllbGQgPSBpc1N0cmluZ0ZpZWxkRGVmKGRpbWVuc2lvbkRlZikgPyB2Z0ZpZWxkKGRpbWVuc2lvbkRlZiwge30pIDogdW5kZWZpbmVkO1xuXG4gIC8vIFNob3VsZCBoYXZlIGdyb3VwaW5nIGxldmVsIG9mIGRldGFpbCB0aGF0IGlzIGRpZmZlcmVudCBmcm9tIHRoZSBkaW1lbnNpb24gZmllbGRcbiAgY29uc3Qgc3RhY2tCeSA9IE5PTlBPU0lUSU9OX0NIQU5ORUxTLnJlZHVjZSgoc2MsIGNoYW5uZWwpID0+IHtcbiAgICBpZiAoY2hhbm5lbEhhc0ZpZWxkKGVuY29kaW5nLCBjaGFubmVsKSkge1xuICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgKGlzQXJyYXkoY2hhbm5lbERlZikgPyBjaGFubmVsRGVmIDogW2NoYW5uZWxEZWZdKS5mb3JFYWNoKChjRGVmKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpZWxkRGVmID0gZ2V0RmllbGREZWYoY0RlZik7XG4gICAgICAgIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBjaGFubmVsJ3MgZmllbGQgaXMgaWRlbnRpY2FsIHRvIHgveSdzIGZpZWxkIG9yIGlmIHRoZSBjaGFubmVsIGlzIGEgcmVwZWF0XG4gICAgICAgIGNvbnN0IGYgPSBpc1N0cmluZ0ZpZWxkRGVmKGZpZWxkRGVmKSA/IHZnRmllbGQoZmllbGREZWYsIHt9KSA6IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIC8vIGlmIGZpZWxkZGVmIGlzIGEgcmVwZWF0LCBqdXN0IGluY2x1ZGUgaXQgaW4gdGhlIHN0YWNrIGJ5XG4gICAgICAgICAgIWYgfHxcbiAgICAgICAgICAvLyBvdGhlcndpc2UsIHRoZSBmaWVsZCBtdXN0IGJlIGRpZmZlcmVudCBmcm9tIHggYW5kIHkgZmllbGRzLlxuICAgICAgICAgIChmICE9PSBkaW1lbnNpb25GaWVsZCAmJiBmICE9PSBzdGFja2VkRmllbGQpXG4gICAgICAgICkge1xuICAgICAgICAgIHNjLnB1c2goe2NoYW5uZWwsIGZpZWxkRGVmfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc2M7XG4gIH0sIFtdKTtcblxuICBpZiAoc3RhY2tCeS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lIG9mZnNldFxuICBsZXQgb2Zmc2V0OiBTdGFja09mZnNldCA9IHVuZGVmaW5lZDtcbiAgaWYgKHN0YWNrZWRGaWVsZERlZi5zdGFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgb2Zmc2V0ID0gc3RhY2tlZEZpZWxkRGVmLnN0YWNrO1xuICB9IGVsc2UgaWYgKGNvbnRhaW5zKFNUQUNLX0JZX0RFRkFVTFRfTUFSS1MsIG1hcmspKSB7XG4gICAgLy8gQmFyIGFuZCBBcmVhIHdpdGggc3VtIG9wcyBhcmUgYXV0b21hdGljYWxseSBzdGFja2VkIGJ5IGRlZmF1bHRcbiAgICBvZmZzZXQgPSBzdGFja0NvbmZpZyA9PT0gdW5kZWZpbmVkID8gJ3plcm8nIDogc3RhY2tDb25maWc7XG4gIH0gZWxzZSB7XG4gICAgb2Zmc2V0ID0gc3RhY2tDb25maWc7XG4gIH1cblxuICBpZiAoIW9mZnNldCB8fCAhaXNTdGFja09mZnNldChvZmZzZXQpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBJZiBzdGFja2VkLCBjaGVjayBzY2FsZSB0eXBlIGlmIGl0IGlzIGxpbmVhclxuICBpZiAoc3RhY2tlZEZpZWxkRGVmLnNjYWxlICYmIHN0YWNrZWRGaWVsZERlZi5zY2FsZS50eXBlICYmIHN0YWNrZWRGaWVsZERlZi5zY2FsZS50eXBlICE9PSBTY2FsZVR5cGUuTElORUFSKSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuY2Fubm90U3RhY2tOb25MaW5lYXJTY2FsZShzdGFja2VkRmllbGREZWYuc2NhbGUudHlwZSkpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgaXQgaXMgYSByYW5nZWQgbWFya1xuICBpZiAoY2hhbm5lbEhhc0ZpZWxkKGVuY29kaW5nLCBmaWVsZENoYW5uZWwgPT09IFggPyBYMiA6IFkyKSkge1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmNhbm5vdFN0YWNrUmFuZ2VkTWFyayhmaWVsZENoYW5uZWwpKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFdhcm4gaWYgc3RhY2tpbmcgc3VtbWF0aXZlIGFnZ3JlZ2F0ZVxuICBpZiAoc3RhY2tlZEZpZWxkRGVmLmFnZ3JlZ2F0ZSAmJiAhY29udGFpbnMoU1VNX09QUywgc3RhY2tlZEZpZWxkRGVmLmFnZ3JlZ2F0ZSkpIHtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5zdGFja05vblN1bW1hdGl2ZUFnZ3JlZ2F0ZShzdGFja2VkRmllbGREZWYuYWdncmVnYXRlKSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdyb3VwYnlDaGFubmVsOiBkaW1lbnNpb25EZWYgPyBkaW1lbnNpb25DaGFubmVsIDogdW5kZWZpbmVkLFxuICAgIGZpZWxkQ2hhbm5lbCxcbiAgICBpbXB1dGU6IGNvbnRhaW5zKFsnYXJlYScsICdsaW5lJ10sIG1hcmspLFxuICAgIHN0YWNrQnksXG4gICAgb2Zmc2V0XG4gIH07XG59XG4iXX0=