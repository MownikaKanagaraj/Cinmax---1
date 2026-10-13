const fs = require('fs');

const headerPath = 'C:/cm/node_modules/react-native-reanimated/Common/cpp/reanimated/CSS/interpolation/transforms/TransformOperationInterpolator.h';
const cppPath = 'C:/cm/node_modules/react-native-reanimated/Common/cpp/reanimated/CSS/interpolation/transforms/TransformOperationInterpolator.cpp';

if (!fs.existsSync(headerPath) || !fs.existsSync(cppPath)) {
  console.log('Target files do not exist');
  process.exit(0);
}

let h = fs.readFileSync(headerPath, 'utf8');
if (!h.includes('#include <reanimated/CSS/common/values/CSSValue.h>')) {
  h = h.replace('#include <memory>', '#include <reanimated/CSS/common/values/CSSValue.h>\n#include <memory>');
}

const oldSpec = `// Specialization for resolvable operations
template <ResolvableOp TOperation>
class TransformOperationInterpolator<TOperation> : public StyleOperationInterpolator {
 public:
  TransformOperationInterpolator(
      const std::shared_ptr<TOperation> &defaultOperation,
      ResolvableValueInterpolatorConfig config);

  std::unique_ptr<StyleOperation> interpolate(
      double progress,
      const std::shared_ptr<StyleOperation> &from,
      const std::shared_ptr<StyleOperation> &to,
      const StyleOperationsInterpolationContext &context) const override;

  std::shared_ptr<StyleOperation> resolveOperation(
      const std::shared_ptr<StyleOperation> &operation,
      const StyleOperationsInterpolationContext &context) const override;

 protected:
  const ResolvableValueInterpolatorConfig config_;

  RelativeValueInterpolationContext getRelativeValueContext(const StyleOperationsInterpolationContext &context) const;
};`;

const newSpec = `// Specialization for resolvable operations
template <ResolvableOp TOperation>
class TransformOperationInterpolator<TOperation> : public StyleOperationInterpolator {
 public:
  TransformOperationInterpolator(
      const std::shared_ptr<TOperation> &defaultOperation,
      ResolvableValueInterpolatorConfig config)
      : StyleOperationInterpolator(defaultOperation), config_(std::move(config)) {}

  std::unique_ptr<StyleOperation> interpolate(
      double progress,
      const std::shared_ptr<StyleOperation> &from,
      const std::shared_ptr<StyleOperation> &to,
      const StyleOperationsInterpolationContext &context) const override {
    const auto &fromOp = *std::static_pointer_cast<TOperation>(from);
    const auto &toOp = *std::static_pointer_cast<TOperation>(to);
    return std::make_unique<TOperation>(fromOp.value.interpolate(progress, toOp.value, getRelativeValueContext(context)));
  }

  std::shared_ptr<StyleOperation> resolveOperation(
      const std::shared_ptr<StyleOperation> &operation,
      const StyleOperationsInterpolationContext &context) const override {
    const auto &resolvableOp = std::static_pointer_cast<TOperation>(operation);
    const auto &resolved = resolvableOp->value.resolve(getRelativeValueContext(context));

    if (!resolved.has_value()) {
      throw std::invalid_argument(
          "[Reanimated] Cannot resolve resolvable operation: " + operation->getOperationName() +
          " for node with tag: " + std::to_string(context.node->getTag()));
    }

    return std::make_shared<TOperation>(resolved.value());
  }

 protected:
  const ResolvableValueInterpolatorConfig config_;

  RelativeValueInterpolationContext getRelativeValueContext(
      const StyleOperationsInterpolationContext &context) const {
    return RelativeValueInterpolationContext{
        .node = context.node,
        .fallbackInterpolateThreshold = context.fallbackInterpolateThreshold,
        .viewStylesRepository = context.viewStylesRepository,
        .relativeProperty = config_.relativeProperty,
        .relativeTo = config_.relativeTo};
  }
};`;

if (h.includes(oldSpec)) {
  h = h.replace(oldSpec, newSpec);
  fs.writeFileSync(headerPath, h, 'utf8');
  console.log('Successfully patched TransformOperationInterpolator.h');
}

let c = fs.readFileSync(cppPath, 'utf8');
const oldCppChunk = `// Specialization for resolvable operations
template <ResolvableOp TOperation>
TransformOperationInterpolator<TOperation>::TransformOperationInterpolator(
    const std::shared_ptr<TOperation> &defaultOperation,
    ResolvableValueInterpolatorConfig config)
    : StyleOperationInterpolator(defaultOperation), config_(std::move(config)) {}

template <ResolvableOp TOperation>
std::unique_ptr<StyleOperation> TransformOperationInterpolator<TOperation>::interpolate(
    double progress,
    const std::shared_ptr<StyleOperation> &from,
    const std::shared_ptr<StyleOperation> &to,
    const StyleOperationsInterpolationContext &context) const {
  const auto &fromOp = *std::static_pointer_cast<TOperation>(from);
  const auto &toOp = *std::static_pointer_cast<TOperation>(to);

  return std::make_unique<TOperation>(fromOp.value.interpolate(progress, toOp.value, getRelativeValueContext(context)));
}

template <ResolvableOp TOperation>
std::shared_ptr<StyleOperation> TransformOperationInterpolator<TOperation>::resolveOperation(
    const std::shared_ptr<StyleOperation> &operation,
    const StyleOperationsInterpolationContext &context) const {
  const auto &resolvableOp = std::static_pointer_cast<TOperation>(operation);
  const auto &resolved = resolvableOp->value.resolve(getRelativeValueContext(context));

  if (!resolved.has_value()) {
    throw std::invalid_argument(
        "[Reanimated] Cannot resolve resolvable operation: " + operation->getOperationName() +
        " for node with tag: " + std::to_string(context.node->getTag()));
  }

  return std::make_shared<TOperation>(resolved.value());
}

template <ResolvableOp TOperation>
RelativeValueInterpolationContext TransformOperationInterpolator<TOperation>::getRelativeValueContext(
    const StyleOperationsInterpolationContext &context) const {
  return RelativeValueInterpolationContext{
      .node = context.node,
      .fallbackInterpolateThreshold = context.fallbackInterpolateThreshold,
      .viewStylesRepository = context.viewStylesRepository,
      .relativeProperty = config_.relativeProperty,
      .relativeTo = config_.relativeTo};
}`;

if (c.includes(oldCppChunk)) {
  c = c.replace(oldCppChunk, '// Specialization methods inlined into TransformOperationInterpolator.h');
  fs.writeFileSync(cppPath, c, 'utf8');
  console.log('Successfully patched TransformOperationInterpolator.cpp');
}
